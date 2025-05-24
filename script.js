// Função para formatar o tamanho para exibição
function formatarTamanho(tamanho) {
    const formatos = {
        'P': 'Pequeno (P)',
        'M': 'Médio (M)',
        'G': 'Grande (G)',
        'U': 'Único',
        'unico': 'Único'
    };
    return formatos[tamanho] || tamanho;
}

// Carrinho de Compras
let carrinho = [];
const carrinhoElement = document.getElementById('carrinho');
const carrinhoItensElement = document.getElementById('carrinho-itens');
const carrinhoContadorElement = document.getElementById('carrinho-contador');
const carrinhoTotalElement = document.getElementById('carrinho-total');
const finalizarPedidoBtn = document.getElementById('finalizar-pedido');
const limparCarrinhoBtn = document.getElementById('limpar-carrinho');

// Ícone do carrinho flutuante
const iconeCarrinho = document.createElement('div');
iconeCarrinho.className = 'icone-carrinho';
iconeCarrinho.innerHTML = '<i class="fas fa-shopping-bag"></i><span>0</span>';
iconeCarrinho.addEventListener('click', toggleCarrinho);
document.body.appendChild(iconeCarrinho);

// Funções do Carrinho
function toggleCarrinho() {
    carrinhoElement.classList.toggle('aberto');
}

function atualizarCarrinho() {
    carrinhoItensElement.innerHTML = '';
    let total = 0;
    
    carrinho.forEach((item, index) => {
        total += item.preco;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'item-carrinho';
        itemElement.innerHTML = `
            <img src="${item.imagem}" alt="${item.nome}">
            <div class="item-carrinho-info">
                <h4>${item.nome}</h4>
                ${item.tamanho ? `<p>Tamanho: ${formatarTamanho(item.tamanho)}</p>` : ''}
                <p>R$ ${item.preco.toFixed(2)}</p>
            </div>
            <button class="remover-item" onclick="removerDoCarrinho(${index})">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        carrinhoItensElement.appendChild(itemElement);
    });
    
    carrinhoTotalElement.textContent = `R$ ${total.toFixed(2)}`;
    carrinhoContadorElement.textContent = carrinho.length;
    iconeCarrinho.querySelector('span').textContent = carrinho.length;
}

function adicionarAoCarrinho(nome, preco, imagem, tamanho) {
    carrinho.push({
        nome: nome,
        preco: preco,
        imagem: imagem || 'img/produto-padrao.jpg',
        tamanho: tamanho || null
    });
    
    atualizarCarrinho();
    carrinhoElement.classList.add('aberto');
}

function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
}

function limparCarrinho() {
    carrinho = [];
    atualizarCarrinho();
}

// Finalizar pedido via WhatsApp
function finalizarPedidoWhatsApp() {
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    const numeroWhatsApp = "+558892927689";
    let mensagem = `Olá! Gostaria de comprar os seguintes itens:\n\n`;
    
    carrinho.forEach(item => {
        mensagem += `✔ ${item.nome}`;
        if (item.tamanho) {
            mensagem += ` (Tamanho: ${formatarTamanho(item.tamanho)})`;
        }
        mensagem += ` - R$ ${item.preco.toFixed(2)}\n`;
    });
    
    mensagem += `\n*Total: R$ ${carrinho.reduce((total, item) => total + item.preco, 0).toFixed(2)}*`;
    mensagem += `\n\nPor favor, me informe as formas de pagamento disponíveis.`;
    
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
}

// Event Listeners
finalizarPedidoBtn.addEventListener('click', finalizarPedidoWhatsApp);
limparCarrinhoBtn.addEventListener('click', limparCarrinho);

// Modificar os botões "Comprar" para adicionar ao carrinho
document.querySelectorAll('.produto button').forEach(button => {
    button.addEventListener('click', function() {
        const produto = this.closest('.produto');
        const nome = produto.querySelector('h3').textContent;
        const preco = parseFloat(produto.querySelector('.preco').textContent.replace('R$ ', '').replace(',', '.'));
        const imagem = produto.querySelector('img').src;
        const tamanho = produto.dataset.tamanho; // Pega o tamanho do data-tamanho
        
        adicionarAoCarrinho(nome, preco, imagem, tamanho);
    });
});

// Fechar carrinho com o botão X
document.querySelector('.fechar-carrinho').addEventListener('click', toggleCarrinho);

// Fechar carrinho ao clicar fora (opcional)
document.addEventListener('click', (e) => {
    if (!carrinhoElement.contains(e.target) && 
        !iconeCarrinho.contains(e.target) && 
        carrinhoElement.classList.contains('aberto')) {
        toggleCarrinho();
    }
});


// Filtro de produtos
document.querySelectorAll('.filtro').forEach(button => {
    button.addEventListener('click', () => {
        // Remove classe ativa de todos os botões
        document.querySelectorAll('.filtro').forEach(btn => btn.classList.remove('ativo'));
        
        // Adiciona classe ativa ao botão clicado
        button.classList.add('ativo');
        
        const categoria = button.dataset.categoria;
        
        // Filtra os produtos (implemente sua lógica de filtro aqui)
        if (categoria === 'todas') {
            document.querySelectorAll('.produto').forEach(prod => prod.style.display = 'block');
        } else {
            document.querySelectorAll('.produto').forEach(prod => {
                prod.style.display = prod.classList.contains(categoria) ? 'block' : 'none';
            });
        }
    });
});

// Highlight menu item ativo
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    
    sections.forEach(sec => {
        const top = window.scrollY;
        const offset = sec.offsetTop - 100;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');
        
        if(top >= offset && top < offset + height) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if(link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});



// Exibir/ocultar menu mobile
document.getElementById('menu-hamburger').addEventListener('click', () => {
    const links = document.querySelector('.mobile-links');
    links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
});

document.addEventListener('DOMContentLoaded', function() {
    // Inicializa todos os carrosséis na página
    document.querySelectorAll('.carrossel-container').forEach(container => {
        const carrossel = container.querySelector('.carrossel');
        const items = container.querySelectorAll('.carrossel-item');
        const btnAnterior = container.querySelector('.carrossel-anterior');
        const btnProximo = container.querySelector('.carrossel-proximo');
        const indicadores = container.parentElement.querySelector('.carrossel-indicadores')?.querySelectorAll('.carrossel-indicador') || [];
        
        let currentIndex = 0;
        const totalItems = items.length;
        
        function updateCarrossel() {
            carrossel.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Atualiza indicadores
            indicadores.forEach((indicador, index) => {
                indicador.classList.toggle('ativo', index === currentIndex);
            });
        }
        
        btnProximo.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalItems;
            updateCarrossel();
        });
        
        btnAnterior.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalItems) % totalItems;
            updateCarrossel();
        });
        
        // Navegação pelos indicadores
        indicadores.forEach(indicador => {
            indicador.addEventListener('click', () => {
                currentIndex = parseInt(indicador.dataset.index);
                updateCarrossel();
            });
        });
        
        // Opcional: Auto-rotacionar (comentar se não quiser)
        // let intervalo = setInterval(() => {
        //     currentIndex = (currentIndex + 1) % totalItems;
        //     updateCarrossel();
        // }, 5000);
        
        // Pausa o auto-rotate quando o mouse está sobre o carrossel
        // container.addEventListener('mouseenter', () => clearInterval(intervalo));
        // container.addEventListener('mouseleave', () => {
        //     intervalo = setInterval(() => {
        //         currentIndex = (currentIndex + 1) % totalItems;
        //         updateCarrossel();
        //     }, 5000);
        // });
    });
});

// Lightbox para todas as imagens de produtos
document.addEventListener('DOMContentLoaded', function() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const closeBtn = document.querySelector('.close-lightbox');
    
    // Adiciona evento de clique para todas as imagens de produtos
    document.querySelectorAll('.produto img').forEach(img => {
        img.addEventListener('click', function() {
            lightbox.style.display = 'block';
            lightboxImg.src = this.src;
            lightboxCaption.textContent = this.alt;
        });
    });
    
    // Fechar lightbox
    closeBtn.addEventListener('click', function() {
        lightbox.style.display = 'none';
    });
    
    // Fechar ao clicar fora da imagem
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
        }
    });
    
    // Fechar com tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.style.display === 'block') {
            lightbox.style.display = 'none';
        }
    });
});

// Filtro por tamanho
document.querySelectorAll('.filtro-tamanho').forEach(btn => {
    btn.addEventListener('click', function() {
        // Remove classe ativa de todos os botões
        document.querySelectorAll('.filtro-tamanho').forEach(b => {
            b.classList.remove('ativo');
        });
        
        // Adiciona classe ativa ao botão clicado
        this.classList.add('ativo');
        
        const tamanho = this.dataset.tamanho;
        const produtos = document.querySelectorAll('#tshirts .carrossel-item');
        
        if (tamanho === 'todos') {
            // Mostra todos os produtos
            produtos.forEach(prod => {
                prod.style.display = 'block';
            });
        } else {
            // Filtra por tamanho selecionado
            produtos.forEach(prod => {
                if (prod.dataset.tamanho === tamanho) {
                    prod.style.display = 'block';
                } else {
                    prod.style.display = 'none';
                }
            });
        }
        
        // Reorganiza o carrossel após filtrar
        reorganizarCarrossel();
    });
});

// Função para reorganizar o carrossel após filtrar
function reorganizarCarrossel() {
    const carrossel = document.querySelector('#tshirts .carrossel');
    const produtosVisiveis = document.querySelectorAll('#tshirts .carrossel-item[style="display: block;"]');
    
    // Reseta a posição do carrossel
    carrossel.style.transform = 'translateX(0)';
    currentIndex = 0;
    
    // Atualiza os indicadores do carrossel
    if (document.querySelector('#tshirts .carrossel-indicadores')) {
        const indicadores = document.querySelectorAll('#tshirts .carrossel-indicador');
        indicadores.forEach((ind, index) => {
            ind.classList.toggle('ativo', index === currentIndex);
            // Esconde indicadores extras se houver menos itens visíveis
            ind.style.display = index < produtosVisiveis.length ? 'block' : 'none';
        });
    }
}