// Define o estado inicial do jogo
const state = {
    // Informações sobre a pontuação do jogador e do computador
    score:{
        playerScore: 0,  // Pontuação do jogador
        computerScore: 0,  // Pontuação do computador
        scoreBox: document.getElementById("score_points"),  // Elemento HTML para mostrar a pontuação
    },
    // Imagens e detalhes das cartas
    cardSprites:{
        avatar: document.getElementById("card-image"),  // Imagem da carta que está sendo exibida
        name: document.getElementById("card-name"),  // Nome da carta
        type: document.getElementById("card-type"),  // Tipo da carta (Papel, Pedra, Tesoura)
    },
    // Elementos que mostram as cartas no campo de jogo
    fielCards:{
        player: document.getElementById("player-field-card"),  // Carta do jogador
        computer: document.getElementById("computer-field-card"),  // Carta do computador
    },
    // Botão para iniciar o próximo duelo
    actions:{
        button: document.getElementById("next-duel"),  // Botão de ação
    },
};

// Define os lados do jogador e do computador
const playerSides = {
    player1: "player-cards",  // Lado do jogador
    computer: "computer-cards",  // Lado do computador
};

// Caminho base para as imagens das cartas
const pathImages = "./src/assets/icons/";

// Dados das cartas do jogo
const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",  // Nome da carta
        type: "Paper",  // Tipo da carta (Papel)
        img: `${pathImages}dragon.png`,  // Caminho da imagem da carta
        WinOf: [1],  // IDs das cartas que a carta ganha
        LoseOf: [2],  // IDs das cartas que a carta perde
    },
    {
        id: 1,
        name: "Dark Magician",  // Nome da carta
        type: "Rock",  // Tipo da carta (Pedra)
        img: `${pathImages}magician.png`,  // Caminho da imagem da carta
        WinOf: [2],  // IDs das cartas que a carta ganha
        LoseOf: [0],  // IDs das cartas que a carta perde
    },
    {
        id: 2,
        name: "Exodia",  // Nome da carta
        type: "Scissors",  // Tipo da carta (Tesoura)
        img: `${pathImages}exodia.png`,  // Caminho da imagem da carta
        WinOf: [0],  // IDs das cartas que a carta ganha
        LoseOf: [1],  // IDs das cartas que a carta perde
    },
];

// Função para pegar uma carta aleatória do conjunto
async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);  // Gera um índice aleatório
    return cardData[randomIndex].id;  // Retorna o ID da carta aleatória
}

// Função para criar uma imagem de carta e adicionar eventos de interação
async function creatCardImage(idCard, fieldSide) {
    const cardImage = document.createElement("img");  // Cria um elemento de imagem para a carta
    cardImage.setAttribute("height", "100px");  // Define a altura da imagem
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");  // Define a imagem de fundo
    cardImage.setAttribute("data-id", idCard);  // Atribui o ID da carta como atributo
    cardImage.classList.add("card");  // Adiciona a classe 'card' à imagem para estilização

    // Se o lado for o do jogador, adiciona eventos de hover e click
    if(fieldSide === playerSides.player1){
        cardImage.addEventListener("mouseover", () => {  // Ao passar o mouse sobre a carta
            drawSelectCard(idCard);  // Exibe os detalhes da carta
        });
        cardImage.addEventListener("click", () => {  // Ao clicar na carta
            setCardsField(cardImage.getAttribute("data-id"));  // Define as cartas no campo de jogo
        });
    }

    return cardImage;  // Retorna a imagem da carta
}

// Função para definir as cartas no campo de jogo
async function setCardsField(cardId) {
    await removeAllCardsImages();  // Remove as cartas do campo

    let computerCardId = await getRandomCardId();  // Obtém uma carta aleatória para o computador

    await showHiddenCardFieldsImages(true);  // Exibe os campos de cartas
    await hiddenCardDetails();  // Oculta os detalhes das cartas
    await drawCardsInField(cardId, computerCardId);  // Desenha as cartas no campo de jogo

    let duelResults = await checkDuelResults(cardId, computerCardId);  // Verifica os resultados do duelo
    await updateScore();  // Atualiza a pontuação
    await drawButton(duelResults);  // Exibe o botão com o resultado do duelo
}

// Função para desenhar as cartas no campo de jogo
async function drawCardsInField(cardId, computerCardId) {
    state.fielCards.player.src = cardData[cardId].img;  // Desenha a carta do jogador
    state.fielCards.computer.src = cardData[computerCardId].img;  // Desenha a carta do computador
}

// Função para mostrar ou ocultar as imagens das cartas no campo
async function showHiddenCardFieldsImages(value) {
    if(value == true){
        state.fielCards.player.style.display = "block";  // Exibe a carta do jogador
        state.fielCards.computer.style.display = "block";  // Exibe a carta do computador
    }
    if(value == false){
        state.fielCards.player.style.display = "none";  // Oculta a carta do jogador
        state.fielCards.computer.style.display = "none";  // Oculta a carta do computador
    }
}

// Função para atualizar a exibição da pontuação
async function updateScore(){
    state.score.scoreBox.innerText = `Vin: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;  // Atualiza a pontuação exibida
}

// Função para ocultar os detalhes da carta (imagem, nome, tipo)
async function hiddenCardDetails() {
    state.cardSprites.avatar.src = "";  // Limpa a imagem da carta
    state.cardSprites.name.innerText = "";  // Limpa o nome da carta
    state.cardSprites.type.innerText = "";  // Limpa o tipo da carta
}

// Função para desenhar o botão com o texto do resultado
async function drawButton(text){
    state.actions.button.innerText = text;  // Define o texto do botão
    state.actions.button.style.display = "block";  // Exibe o botão
}

// Função para verificar os resultados do duelo entre as cartas
async function checkDuelResults(playerCardId, computerCardId){
    let duelResults = "DRAW";  // Inicialmente considera que o resultado é um empate
    let playerCard = cardData[playerCardId];  // Obtém os dados da carta do jogador

    // Se a carta do jogador vence a carta do computador
    if(playerCard.WinOf.includes(computerCardId)){
        duelResults = "WIN";  // Define que o jogador venceu
        await playAudio(duelResults);  // Toca o áudio de vitória
        state.score.playerScore++;  // Incrementa a pontuação do jogador
    }
    // Se a carta do jogador perde para a carta do computador
    if(playerCard.LoseOf.includes(computerCardId)){
        duelResults = "LOSE";  // Define que o jogador perdeu
        await playAudio(duelResults);  // Toca o áudio de derrota
        state.score.computerScore++;  // Incrementa a pontuação do computador
    }
    return duelResults;  // Retorna o resultado do duelo
}

// Função para remover todas as imagens das cartas
async function removeAllCardsImages() {
    let cards = document.querySelector("#computer-cards");  // Seleciona as cartas do computador
    let imgElements = cards.querySelectorAll("img");  // Seleciona todas as imagens das cartas
    imgElements.forEach((img) => img.remove());  // Remove as imagens das cartas

    cards = document.querySelector("#player-cards");  // Seleciona as cartas do jogador
    imgElements = cards.querySelectorAll("img");  // Seleciona todas as imagens das cartas
    imgElements.forEach((img) => img.remove());  // Remove as imagens das cartas
}

// Função para desenhar os detalhes da carta selecionada
async function drawSelectCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;  // Exibe a imagem da carta
    state.cardSprites.name.innerText = cardData[index].name;  // Exibe o nome da carta
    state.cardSprites.type.innerText = "Atribute: " + cardData[index].type;  // Exibe o tipo da carta
}

// Função para desenhar várias cartas
async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();  // Pega uma carta aleatória
        const cardImage = await creatCardImage(randomIdCard, fieldSide);  // Cria a imagem da carta

        document.getElementById(fieldSide).appendChild(cardImage);  // Adiciona a imagem da carta ao campo
    }
}

// Função para resetar o duelo
async function resetDuel() {
    state.cardSprites.avatar.src = "";  // Limpa a imagem da carta
    state.actions.button.style.display = "none";  // Oculta o botão

    state.fielCards.player.style.display = "none";  // Oculta a carta do jogador
    state.fielCards.computer.style.display = "none";  // Oculta a carta do computador

    init();  // Inicializa o jogo novamente
}

// Função para tocar áudio com base no status do duelo
async function playAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.wav`);  // Cria o objeto de áudio
    audio.play();  // Reproduz o áudio
}

// Função para inicializar o jogo
function init(){
    showHiddenCardFieldsImages(false);  // Oculta as cartas iniciais
    drawCards(5, playerSides.player1);  // Desenha 5 cartas para o jogador
    drawCards(5, playerSides.computer);  // Desenha 5 cartas para o computador

    const bgm = document.getElementById("bgm");  // Seleciona o elemento de áudio de fundo
    bgm.play();  // Reproduz a música de fundo
}

// Inicializa o jogo
init();  
