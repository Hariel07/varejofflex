import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';
import Company from '@/models/Company';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Verificar se é owner/admin
    if ((session.user as any).role !== 'owner_saas') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const { id: userId } = await params;

    if (!userId) {
      return NextResponse.json({ error: 'ID do usuário é obrigatório' }, { status: 400 });
    }

    await dbConnect();

    // Buscar dados do usuário
    const user = await User.findById(userId)
      .select('-passwordHash')
      .lean();

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Buscar empresa relacionada
    const company = await Company.findOne({ userId }).lean();

    // Buscar estatísticas relacionadas
    const stats = {
      hasCompany: !!company,
      companyName: company?.name || null,
      verificationCodes: 0,
      paymentAttempts: 0,
      passwordResets: 0
    };

    // Contar códigos de verificação
    try {
      const VerificationCode = (await import('@/models/VerificationCode')).default;
      stats.verificationCodes = await VerificationCode.countDocuments({
        $or: [
          { email: user.email },
          { 'userData.email': user.email }
        ]
      });
    } catch (error) {
      console.log('Erro ao contar códigos de verificação:', error);
    }

    // Contar tentativas de pagamento
    try {
      const PaymentAttempt = (await import('@/models/PaymentAttempt')).default;
      stats.paymentAttempts = await PaymentAttempt.countDocuments({
        email: user.email
      });
    } catch (error) {
      console.log('Erro ao contar tentativas de pagamento:', error);
    }

    // Contar tokens de reset
    try {
      const PasswordResetToken = (await import('@/models/PasswordResetToken')).default;
      stats.passwordResets = await PasswordResetToken.countDocuments({
        userId: user._id
      });
    } catch (error) {
      console.log('Erro ao contar tokens de reset:', error);
    }

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        company
      },
      stats,
      canDelete: user.role !== 'owner_saas',
      warningMessage: user.role === 'owner_saas' 
        ? 'Não é possível excluir outros owners da plataforma'
        : null
    });

  } catch (error: any) {
    console.error('Erro ao buscar detalhes do usuário:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}