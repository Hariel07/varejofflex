// Script para criar usuário de teste para exclusão
// Execute este script no console do navegador quando estiver logado como owner

async function criarUsuarioTeste() {
  try {
    console.log('🔧 Criando usuário de teste...');
    
    const response = await fetch('/api/auth/create-test-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Usuário Teste Para Excluir',
        email: 'teste.exclusao@exemplo.com',
        role: 'logista',
        password: 'senha123'
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Usuário de teste criado:', data.user);
      console.log('📧 Email:', data.user.email);
      console.log('🔑 Senha: senha123');
      console.log('🎯 Agora vá para a aba "Usuários" e você verá o botão de excluir!');
      alert('Usuário de teste criado! Vá para a aba "Usuários" e você verá o botão de excluir.');
    } else {
      console.error('❌ Erro ao criar usuário:', data.error);
      alert('Erro ao criar usuário: ' + data.error);
    }
  } catch (error) {
    console.error('❌ Erro:', error);
    alert('Erro: ' + error.message);
  }
}

// Executar automaticamente
criarUsuarioTeste();