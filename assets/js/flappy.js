//Manipulando a arvore DOM  (conceitos de orientação a objeto)
function novoElemento(tagName , className){
    const elemento = document.createElement(tagName)
    elemento.className = className
    return elemento
}

//Criação de um OBJETO com variaveis: com vários Valores - funções dentro de funções

//Criando componente BARREIRAS
function Barreira(inferior = false){
    this.elemento = novoElemento('div', 'barreira')
    const corpo = novoElemento('div', 'corpo')
    const borda = novoElemento('div', 'borda')
    if(inferior){
        this.elemento.appendChild(borda)
        this.elemento.appendChild(corpo)
    }else{
        this.elemento.appendChild(corpo)
        this.elemento.appendChild(borda)
    }
    this.setAltura = (altura) => corpo.style.height = altura+'px'
}
// Criação dos pares de BARREIRAS
function ParBarreiras(alturaGame,aberturaBarreiras,eixoX){
    this.elemento = novoElemento('div', 'barreiras')
    this.superior = new Barreira()
    this.inferior = new Barreira(true)
    this.elemento.appendChild(this.superior.elemento)
    this.elemento.appendChild(this.inferior.elemento)
//Criando uma AERO FUNCTION dentro do js -> SET -COLOCAR VALOR EM X E GET - SABER VALOR DE X 
    this.setX = (x) => this.elemento.style.left = x+'px'
//para saber se houve colisão do PASSARO com a BARREIRA pegar valor de X 
    this.getX = () => {
        px = this.elemento.style.left 
        x = px.split('px')
        return (parseInt(x))
    }



// Criar uma Aero Function para  retornar o tamanho das barreiras pelo game no f12
this.getWidht = () => this.elemento.clientWidth

//criar FUNÇÃO para sortear abertura das BARREIRAS
    this.sortearAbertura = () => {
        const alturaSuperior = parseInt(
        Math.random() * (alturaGame - aberturaBarreiras))
        const alturaInferior = alturaGame - alturaSuperior - aberturaBarreiras
        this.superior.setAltura(alturaSuperior)
        this.inferior.setAltura(alturaInferior)
    }

    this.setX(eixoX)
//chamada de sorteio de aberturasdas BARREIRAS
    this.sortearAbertura()
}

//Criando o GESTOR BARREIRAS
function GestorBarreiras(alturaGame,larguraGame,aberturaBarreira,distanciaBarreira,deslocamento,pontos){
    const nBarreiras = Math.round(larguraGame/distanciaBarreira)+1
    this.barreiras = []
// calculo matemático colocar as barreiras no lugar delas (posições das barreiras)
    for(cont=0;cont<nBarreiras;cont++){
        eixoX = larguraGame+distanciaBarreira*cont
        this.barreiras.push(new ParBarreiras(alturaGame,aberturaBarreira,eixoX))
    }
    const meio= larguraGame/2
    this.animar = () => {
        this.barreiras.forEach((bar, indice) =>{
            bar.setX(bar.getX()-deslocamento)
            if(bar.getX()+bar.getWidht()<=0){
                let posicao = (indice>0?indice:this.barreiras.length)
                bar.setX(this.barreiras[posicao-1].getX()+distanciaBarreira)
                bar.sortearAbertura()
            }
// definindo o score de PONTUAÇÃO após passar o meio das barreiras
            if(bar.getX()<meio && bar.getX()+deslocamento >=meio){
                pontos()
            }
            })
    }
}

//Criando o PASSARO e suas características
function Passaro(alturaGame){
    this.elemento = novoElemento('img','passaro')
    this.elemento.src = 'assets/images/passaro.png'


//Lembrando quem se movem são as BARREIRAS e não o passaro aqui tratamos o movimento das barreiras
    this.getY = () =>{
        px = this.elemento.style.bottom
        y = px.split('px')
        return (parseInt(y))
    }
    this.setY = (y) => this.elemento.style.bottom = y+'px'
    this.setY(alturaGame/2)
//criando FUNÇÃO DE ANIMAÇÃO DO PASSARO*/
this.voando = false
//Definindo novos parametros de animação (os 03 comandos abaixo comentados)
//let voando = false
//window.onkeydown = (e) => voando = true
//window.onkeyup = (e) => voando = false


const alturaMaxima = alturaGame - this.elemento.clienteHeight
this.animar = () =>{
// defindo  animação e o movimento do voo do passado up e down
    let val = 0;
    if(this.voando == 'up'){
        val = 5;
    }else if(this.voando == 'down'){
        val = -5;
    }
    let novoy = this.getY()+val;
    // Comando abaixo é alternativo (comentado)
    //let novoy = this.getY()+(this.voando ? 5:-5)
         
    console.log(this.voando)
    if(novoy<0){
        novoy = 0
    }else if(novoy>alturaMaxima)
    {
        novoy= alturaMaxima

    }
    this.setY(novoy)
    }

}   
//Criando PONTUAÇÃO
function Pontuacao(){
    this.elemento = novoElemento('span','pontos')
    this.atualizarPontos = (pontos) => this.elemento.innerHTML = pontos
    this.atualizarPontos(0)
}


//criando a COLISÃO*/
function colisao(elemento1,elemento2){
    const a = elemento1.getBoundingClientRect()
    const b = elemento2.getBoundingClientRect()

    const colisaox = a.left + a.width >= b.left && b.left + b.width >= a.left
    const colisaoy = a.top + a.height >= b.top && b.top + b.height >= a.top
    return colisaox && colisaoy
}
function chekColisao(passaro,gestorbarreiras){
    let colidiu = false
    gestorbarreiras.barreiras.forEach((barreira) => {
        const superior = barreira.superior.elemento
        const inferior = barreira.inferior.elemento
        if(colisao(passaro.elemento, superior)|| colisao(passaro.elemento, inferior)){
            console.log()
            colidiu = true
        } 
    })
    return colidiu
}
//criando  o FLAPPYBIRD 
function flappyBird(){
    const game = document.querySelector('.game')
//Definindo ALTURA e LARGURA do GAME*/
    const altura = game.clientHeight
    const largura = game.clientWidth
    
//Recriando  código do PASSARO- iniciando JavaScript barreira DOM
    const passaro = new Passaro(altura)
    const pontuacao = new Pontuacao()
    let pontos = 0
    const gestorBarreiras = new GestorBarreiras(altura,largura,200,400,4,() =>pontuacao.atualizarPontos(++pontos))
    game.appendChild(passaro.elemento)
    gestorBarreiras.barreiras.forEach(barreira => {
        game.appendChild(barreira.elemento)
})

//função de iniciar o jogo e criando variável temporizador*/
    game.appendChild(pontuacao.elemento)
    this.start = () => {

     
        confirm (" VAMOS JOGAR ? ")     
        const temporizador = setInterval(() =>{  
            gestorBarreiras.animar()
            passaro.animar()
            if(chekColisao(passaro, gestorBarreiras,)){

                clearInterval(temporizador)
                if(confirm("GAME OVER !  Você perdeu com um total de  " +pontos+ "  pontos. Gostaria de jogar novamente?")){
                    document.location.reload()
                }
            }
        },20)

    }  

// Definindo as Teclas de Setas para CIMA e para BAIXO para movimentar o passaro.

     window.onkeydown = (e) =>{
        passaro.voando = "front"
        if(e.keyCode == 38){
            passaro.voando = 'up'
        }else if(e.keyCode == 40){
            passaro.voando = 'down'
        }
      // Teclas definidas do  teclado
     } 
     window.onkeyup = (e) => {
        passaro.voando = false

        window.onkeypress = (e.keycode == 80)
     }   
 
}

//comando de iniciar o jogo -START
new flappyBird().start()



