import { criarPublicacao, atualizarLinhaDoTempo, excluirPublicacao } from '../../Firebase/Firestore.js';
import { sair, verificarStatusUsuario } from '../../Firebase/FirebaseAuth.js';

export default () => {
  const linhaDoTempo = document.createElement('div');

  const conteudo = `
  <div id="headerContainer">
  <div id="usuarioPostagem">
    <p class="nomeUsuario">Usuário</p>
    <img id="iconeCriarPostagem" src="Imagens/criarPostagem.png" alt="Ícone Criar Postagem">
  </div>
  <button id="botaoSair">Sair</button>
</div>
<section id="feed">
  <div id="criarPostContainer">
    <textarea id="caixaDeTextoPost" placeholder="Escreva seu Post aqui..."></textarea>
    <button id="botaoPublicar" class="botaoPublicar">Publicar</button>
  </div>
  <div id="conteudoLinhaDoTempo"</div>
  </div>
  </section>
  `;

  linhaDoTempo.innerHTML = conteudo;
  const conteudoLinhaDoTempo = linhaDoTempo.querySelector('#conteudoLinhaDoTempo');

  // Função para manter usuário logado e deslogado
  if (verificarStatusUsuario()) {
    window.location.hash = '#linhaDoTempo';
  } else {
    window.location.hash = '#telaInicial';
  }

  // funcao sair
  const botaoSair = linhaDoTempo.querySelector('#botaoSair');
  botaoSair.addEventListener('click', (event) => {
    event.preventDefault();
    sair().then(() => {
      window.location.hash = '#telaInicial';
    }).catch(() => {
      alert('Erro ao fazer logout');
    });
  });

  // função para mostrar e esconder caixa de texto para inserção de post
  const iconeCaixaDePostagem = linhaDoTempo.querySelector('#iconeCriarPostagem');

  function abrirCaixaDeTextoPostagem() {
    const caixaDeTextoPostagem = linhaDoTempo.querySelector('#criarPostContainer');

    if (caixaDeTextoPostagem.style.display === 'block') {
      caixaDeTextoPostagem.style.display = 'none';
    } else {
      caixaDeTextoPostagem.style.display = 'block';
    }
  }

  function limparTela() {
    conteudoLinhaDoTempo.innerHTML = '';
  }

  function criarEstrturaDoPost(autor, conteudoPost, data, curtidas, idPublicacao) {
    // Criação dos elementos de post e icones de forma dinamica
    const iconeEditar = document.createElement('img');
    iconeEditar.src = 'Imagens/editar.png';
    const iconeSalvar = document.createElement('img');
    iconeSalvar.src = 'Imagens/IconeSalvar.png';
    const iconeLixeira = document.createElement('img');
    iconeLixeira.src = 'Imagens/Lixeira.png';

    // o valor do documento é guardado em cada icone de lixeira
    // para quando houver o clique saber qual o id do documento clicacdo
    iconeLixeira.setAttribute('data-postId', idPublicacao);
    const iconeCurtir = document.createElement('img');
    iconeCurtir.src = 'Imagens/iconeCurtir.png';
    const iconeCurtida = document.createElement('img');
    iconeCurtida.src = 'Imagens/iconeCurtida.png';

    // inserindo os elementos criados no conteúdo da div de post criada no HTML
    const postagens = document.createElement('div');
    postagens.textContent = `${autor}: ${conteudoPost} ${data} ${curtidas}`;
    conteudoLinhaDoTempo.appendChild(postagens);
    conteudoLinhaDoTempo.appendChild(iconeEditar);
    conteudoLinhaDoTempo.appendChild(iconeSalvar);
    conteudoLinhaDoTempo.appendChild(iconeLixeira);
    conteudoLinhaDoTempo.appendChild(iconeCurtir);

    postagens.className = 'postagens';
    iconeEditar.className = 'editar';
    iconeSalvar.className = 'salvar';
    iconeLixeira.className = 'excluir';
    iconeCurtir.className = 'curtir';
    iconeCurtida.className = 'curtida';

    // const excluir = linhaDoTempo.querySelector('.excluir');

    iconeLixeira.addEventListener('click', (event) => {
      // constante que pega o valor do id do documento que está
      // armszenado no icone da lixeira, no evento de clique.
      const idPost = event.target.dataset.postid;
      excluirPublicacao(idPost);
      atualizarLinhaDoTempo(criarEstrturaDoPost, limparTela);
    });

    iconeCurtir.addEventListener('click', () => {
      const imagem1 = document.createElement('img');

      // validação

      iconeCurtir.src = '../../Imagens/IconeCurtida.png';
      imagem1.alt = 'Imagem 1';

      // setTimeout(() => {
      //   container.replaceChild(imagem1, imagem2);
      // }, 2000);
    });
  }
  // função criar publicacao e adicionar a linha do tempo
  const botaoPublicar = linhaDoTempo.querySelector('#botaoPublicar');
  botaoPublicar.addEventListener('click', (evento) => {
    const conteudoPublicacao = linhaDoTempo.querySelector('#caixaDeTextoPost').value;
    evento.preventDefault();
    if (conteudoPublicacao === '') {
      alert('O campo de postagem não pode ser enviado vazio!');
      return;
    }

    criarPublicacao(conteudoPublicacao);

    atualizarLinhaDoTempo(criarEstrturaDoPost, limparTela);
  });

  iconeCaixaDePostagem.addEventListener('click', abrirCaixaDeTextoPostagem);
  // chama a função novamente para redenrizar os componentes na tela
  atualizarLinhaDoTempo(criarEstrturaDoPost, limparTela);

  return linhaDoTempo;
};
