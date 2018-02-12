var A, B, C;

var SERVER_NUMBERS = 1024;
var MAX_NUMBERS;
var dist;
var numbers = [];

function recalc(){
	
	MAX_NUMBERS = $("#max_numbers").val() * 1;
	dist = $("#dist").val();
	deleteGrafico();
	
	
	numbers = [];
	createBar();
	updateBar( 0 );
	
	num_chamadas = 10;
	// Inicia o timer/contador "SERVIDOR_ASTRALIANO"
	console.time("SERVIDOR_ASTRALIANO");
	for (i = 0; i < num_chamadas; i++) { loadRandomNumbers2(); }
	loadRandomNumbers();
}

/*
 Descrição: carrega os números gerados pelo servidor de números aleatórios
*/
function loadRandomNumbers(){

	numbersFalta = MAX_NUMBERS - numbers.length;
	console.clear();
	console.log("falta " + numbersFalta);
	
	$.post("https://qrng.anu.edu.au/API/jsonI.php?length=" + (numbersFalta % SERVER_NUMBERS) + "&type=uint16", function( data ){
		numbers = numbers.concat( data.data );
		//console.log( data.data );
		
		
	})	
	.done(function(){
		if(numbers.length < MAX_NUMBERS){
			updateBar(numbers.length);
			loadRandomNumbers();
		}
		else{
			updateBar(MAX_NUMBERS);
			
			// Obtém o total de tempo decorrido
			console.clear();
			console.timeEnd("SERVIDOR_ASTRALIANO");
			
			if (dist == "pert")
				simulacao_pert(numbers);	
			else
				simulacao_tri(numbers);
			showGrafico();
			$('#descricao').text("Simulação concluida: 100%");
		}
		//console.log( "done" );	
	})
	.fail(function() {
		//console.log( "error" );
	})
	.always(function() {
		//console.log( "complete" );
	});	
};	


function loadRandomNumbers2(){
	numbersFalta = MAX_NUMBERS - numbers.length;
	console.clear();
	console.log("falta " + numbersFalta);
	
	if(numbersFalta > 0){
		$.post("https://qrng.anu.edu.au/API/jsonI.php?length=" + (numbersFalta % SERVER_NUMBERS) + "&type=uint16", function( data ){
			numbers = numbers.concat(data.data);
			
			
		})	
		.done(function(){
			if(numbers.length < MAX_NUMBERS){
				updateBar(numbers.length);
				loadRandomNumbers2();
			}
			//console.log( "done" );	
		})
		.fail(function() {
			console.log( "error" );
		})
		.always(function() {
			//console.log( "complete" );
		});	
	}
};	

function simulacao_tri(numbers){
	A = $("#otimista").val() * 1;
	B = $("#maisProvavel").val() * 1;
	C = $("#pessimista").val() * 1;
	
	converte(numbers);						//Passa os números da faixa 0-255 para a faixa 0-1
	triangularDistribution(numbers, A, B, C );	//numbers é carregado com o array de probabilidades
		
	numbers.sort(function (a, b) { 
		return a - b;
	});
	
	var NumClasses = calcNumeroDeClasses(numbers.length);	//Calcula o número de classes com base na quantidade de números aleatórios gerados
	//console.log("Número de classes: " + NumClasses);
	var AmplTotal = calcAmplitudeTotal(numbers);			//Calcula a amplitude total
	//console.log("Amplitude Total: " + AmplTotal);
	var AmplClasse = AmplTotal/NumClasses;					//Calcula a valor da amplitude de cada classe
	//console.log("Amplitude de Classe: " + AmplClasse);
	
	freqClasses = calcFrequenciaDeClasses(numbers, A, AmplClasse, NumClasses);		//FreqClasses armazena a frequência de números em cada classe
	//console.log("Frequencia das classes: " + freqClasses);
	
	//console.log("Números aleatorios: " + numbers);
	exibeHistograma(NumClasses, freqClasses, AmplClasse, numbers[0]);
}

function simulacao_pert( numbers ){
	A = $("#otimista").val() * 1;
	B = $("#maisProvavel").val() * 1;
	C = $("#pessimista").val() * 1;	
	converteII( numbers, A, C);
	numbers.sort( function (a, b) { 
		return a - b;
	});
	console.log( numbers );
	distribuicao = distBeta( numbers, A, B, C );
	//distNormal( numbers );
	//console.log( numbers );
	//console.log( distribuicao.length );
	showHistograma( distribuicao, numbers, 'grafico' );
}

/*
 Descrição: converte um vetor com números na faixa de 0 a 255 para um vetor com números na faixa de 0 a 1.
 Parâmetros: 	numbers é o array com números inteiros de 0 a 255
 Retorno: numbers é retornado, mas agora sua faixa de valores é de números reais de 0 a 1
*/
function converte(numbers){
	var  i;
	for(i = 0; i < numbers.length; i++){
		numbers[i] = numbers[i] / 65535;	
	}
}
function converteII(numbers, a, b){
	var  i, aux;
	for(i = 0; i < numbers.length; i++){
		aux = numbers[i] / 65535;
		if ( (aux * b) < a ){
			aux = aux + a;
		}else{
			aux = aux * b;
		}
		numbers[i] = aux;	
	}
}

function mediaAritmetica(amostras){
	var i = 0;
	var media = 0;
	var somatorio = 0;
	
	for(i = 0; i < amostras.length; i++){        // calcula o valor médio das amostras
		somatorio = somatorio + amostras[i];	 // somatório dos valores das amostras
	}
	media = somatorio / amostras.length;		 // cálculo da média
	return media;								 // retorna o valor da média aritmética
}
function desvioPadrao( amostras, media ){
	var i = 0;
	var somatorio = 0;
	var diferenca = 0;
	var sigma = 0;
	
	somatorio = 0;								 // zera somatório
	for(i = 0; i < amostras.length; i++){		 // cálculo da soma dos quadrados das diferenças entre as variáveis aleatórias
		diferenca = amostras[i] - media;		 // cálculo da diferença entre o valor da amostra e o valor médio
		diferenca = diferenca * diferenca;		 // cálculo do quadrado da diferença
		somatorio = somatorio + diferenca;		 // somatório do quadrado da diferença
	}
	sigma = somatorio / ( amostras.length );	 // divide o resultado por n - 1 
	sigma = Math.sqrt( sigma );					 // obtem a raiz quadrada do valor
	return sigma;								 // retorna o valor do desvio padrão
}

function getAlpha(a, m, b){
	var alpha = 2 * ( b + (4 * m) - (5 * a));
	alpha = alpha / (3 * (b - a) );
	alpha = alpha * ( 1 + 4 * ( ( (m - a) * (b - m) ) / Math.pow((b - a), 2) ) );
	return alpha;
}
function getBeta( a, m, b ){
	var beta = 2 * ( (5 * b) - (4 * m) - a );
	beta = beta / (3 * (b - a) );
	beta = beta * ( 1 + 4 * ( ( (m - a) * (b - m) ) / Math.pow((b - a), 2) ) );
	return beta;
}

function beta(alpha, beta ){
	var gAlpha = gamma( alpha - 1);
	var gBeta = gamma( beta - 1);
	var gAlphaBeta = gamma( alpha + beta - 1);
	return gAlpha * gBeta / gAlphaBeta;
}

var g = 7;
var vC = [0.99999999999980993, 676.5203681218851, -1259.1392167224028,771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];

function gamma(z) {
	if (z % 1 != 0 || z<0){
		if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
		else {
			z--;

			var x = vC[0];
			for (var i = 1; i < g + 2; i++){
				x += vC[i] / (z + i);
			}

			var t = z + g + 0.5;
			return Math.sqrt(2 * Math.PI) * Math.pow(t, (z + 0.5)) * Math.exp(-t) * x;
		}
	}
	else {
		z--;
		if(z == 0) {
		   return 1;
		}
		for(var i = z; --i; ) {
		   z *= i;
		}
		return z;
	}
}

/*
 Descrição: calcula a distribuição triangular de probabilidades
 Usa: Math.sqrt(x), a raiz quadrada de x 
 Parâmetros: 	numbers é o array de números aleatórios
				mínimo é o menor valor estimado    A
				melhor é o melhor valor estimado   B
				máximo é o maior valor estimado    C
 Retorno: numbers agora é o array contendo a distribuição de probabilidades (variaveis aleatórias da distribuição triangular)
*/
function triangularDistribution(numbers, minimo, melhor, maximo){ 
	var limiar;   				    				// é o limiar, sendo calculado por (melhor - minimo) / (maximo - minimo)
	var i = 0;										// contador para o laço
	var difMelhorMinimo = melhor - minimo;			// calcula a diferença entre a melhor e a menor estimativa  B - A
    var difMaximoMinimo = maximo - minimo;			// calcula a diferença entre a máxima e a menor estimativa  C - A
    var difMaximoMelhor = maximo - melhor;			// calcula a diferença entre a máxima e a melhor estimativa	C - B
	limiar = difMelhorMinimo / difMaximoMinimo; 	// cálculo do limiar (B - A) / (C - A)
	
	for(i = 0; i < numbers.length; i++){	    	
		if(numbers[i] >= limiar){					
			// se o número aleatório é maior que o limiar
			// C - Raiz ( (1 - x) (C - B) (C - A) )
			numbers[i] =  maximo -  Math.sqrt( ( 1 - numbers[i] ) * difMaximoMelhor  * difMaximoMinimo ); 
		}else{										
			// o número aleatório é menor que o limiar
			// A + Raiz ( x (B - A) (C - A) )	
			numbers[i] =  minimo + Math.sqrt( numbers[i] * difMelhorMinimo * difMaximoMinimo); 	 
		}
	}
}

function distBeta( numbers, a, m, b ){
	var alpha = getAlpha(a, m, b);
	var Beta = getBeta(a, m, b);
	var functBeta = beta(alpha, Beta);
	var result = 0;	
	var distribuicao = [];
	var i = 0;
	for(i = 0; i < numbers.length; i++){
		result = Math.pow( (numbers[i] - a) , (alpha - 1));
		result = result * Math.pow( (b - numbers[i]) , (Beta - 1) );
		distribuicao[i] = result / (functBeta * Math.pow( (b - a) , (alpha + Beta - 1) ));
	}
	return distribuicao;
}
function distNormal( numbers ){
	var media = mediaAritmetica( numbers );
	var desvioP = desvioPadrao( numbers, media );	
	var numerador = 0;
	var denominador = 0;
	var expoente = 0;
	var i = 0;
	for(i = 0; i < numbers.length; i++){
		expoente = -0.5 * Math.pow( ( numbers[i] - media ) / desvioP , 2 );
		numerador = Math.pow( Math.E, expoente );
		denominador = desvioP * Math.sqrt( 2 * Math.PI );
		numbers[i] = numerador / denominador;
		//console.log( numbers[i] );		
	}
	//console.log( numbers.length );
}

/*
 Descrição: calcula a frequência de aparição dos numeros aleatórios em cada uma das classes
 Parâmetros: 	numbers é o array de números aleatórios
				mínimo é o menor valor estimado    A
				máximo é o maior valor estimado    C
 Retorno: FreqClasses é o array contendo o número de valores presentes em cada classes após serem gerados pelo servidor de números aleatórios
*/
function calcFrequenciaDeClasses(numbers, minimo, AmplClasse, NumClasses){

	//Armazena o total de valores presentes em cada classe, sendo que cada posição do vetor corresponde
	//à uma classe, e o último índice representa os valores fora dos limies das classes
	var FreqClasses = new Array(NumClasses + 1);
	
	var i;
	for(i = 0; i < FreqClasses.length; i++){				//Inicia o total de numeros presente em cada classes com o valor 0 para que a contagem seja iniciada
		FreqClasses[i] = 0;
	}
	                          
	//Para cada numero gerado presente no vetor numbers, é calculada sua aplitude e este valor é dividido pela amplitude da classe
	//O valor obtido, desconsiderando a parte decimal, representa a classe correspondente ao número;
	//Então o contador referende á esta classe é incrementado
	for(i = 0; i < numbers.length; i++){
		var ClasseAtual = parseInt((numbers[i] - minimo) / AmplClasse);
		if(ClasseAtual < FreqClasses.length)
			FreqClasses[ClasseAtual]++;
		else
			FreqClasses[FreqClasses.length - 1]++;
	}
	
	return FreqClasses;	//Retorna o vetor contendo a frequência de valores em cada classe
}

/*
 Descrição: retorna o número de classes, que correspondeà raiz quadrada do total de números gerados
 Usa: Math.sqrt(x), a raiz quadrada de x 
 Parâmetros: 	size é o tamanho do vetor que contém os números aleatórios gerados
				(size representa a quantidade de números aleatórios)
 Retorno: retorna um inteiro que determina quantas classes devem ser criadas
*/
function calcNumeroDeClasses(size){
	return parseInt(Math.sqrt(size));
}

function showHistograma(distribuicao, numbers, canvas){
	google.load('visualization', '1.0', { 'packages': ['corechart'], callback: createHistogram });	
	function createHistogram() {                         	// cria o histograma
		var data = new google.visualization.DataTable(); 	// dataTable do histograma
		data.addColumn('number', 'Valor' );             	// cria a coluna classes -> variável aleatória
		data.addColumn('number', 'frequencia' );          		// cria a coluna valor
		data.addColumn('number', 'acumulada' );          		// cria a coluna valor
		data.addRows(distribuicao.length);                  // cria quantidade de linhas da tabela = número de classes
		
		var acumulada = [];
		acumulada[0] = distribuicao[0];
		for(i = 1; i < distribuicao.length; i++){
			acumulada[i] = acumulada[i-1] + distribuicao[i];
		}
		total = acumulada[i-1];
		for(i = 0; i < distribuicao.length; i++){
			//console.log(frequencias[i].variavel);
			data.setValue(i, 0, numbers[i]);			  // add uma coluna
			data.setValue(i, 1, distribuicao[i] );				  // add a frequencia da coluna
			data.setValue(i, 2, (acumulada[i] / total));

		}

		
		var options = {												  // set the chart options
			title: 'DISTRIBUIÇÃO BETA',		  // set o título do histograma
			hAxis: {title: "Duração"},			
			series: {
				0: { type: "bars", targetAxisIndex: 0 },
				1: { type: "line", targetAxisIndex: 1}
			},
			vAxes: {
				0: {
					title: 'Frequência absoluta'
				},
				1: {
					title: 'Frequência acumulada (%)'
				}
			}			
		};  

    

		//instantiate and draw our chart, passing in the options
		var histograma = new google.visualization.ComboChart(document.querySelector('#'+canvas));
		histograma.draw(data, options);		// draw histograma
	}
}

/*
 Descrição: calcula a amplitude atotal dos números gerados, isto é, a distãncia entre o maior número gerado e o menor número gerado
 Usa: a função sort() para ordenar o vetor
 Parâmetros: 	numbers é o array de números aleatórios
 Retorno: 	a diferença entre o valor armazenado na última posição do vetor (que após a ordenação representa o maior valor do vetor)
			e o valor armazenado na primeira posição do vetor (que após a ordenação representa o maior valor do vetor)
*/
function calcAmplitudeTotal(numbers){
	return (numbers[numbers.length - 1] - numbers[0]);
}

function calcLimiteClasse(classeAtual, amplClasse, minimo){

	var limiteSuperior = (classeAtual + 1) * amplClasse + minimo;
	return limiteSuperior;
}

function exibeHistograma(NumClasses, freqClasses, amplClasse, menor){

	// Load the Visualization API and the piechart package.
	google.load('visualization', '1.0', {'packages':['corechart'], callback: drawChart});

	// Set a callback to run when the Google Visualization API is loaded.
	google.setOnLoadCallback(drawChart);

	// Callback that creates and populates a data table,
	// instantiates the pie chart, passes in the data and
	// draws it.
	function drawChart() {
		// Create the data table.
		var data = new google.visualization.DataTable();
		data.addColumn('string', 'limite');
		data.addColumn('number', 'frequencia');
		data.addColumn('number', 'acumulada	');
		var colunas = carregaTabela(NumClasses, freqClasses, amplClasse, menor);
		data.addRows(colunas);

		/* Set chart options
		var options = {'title':'Distribuicao triangular',
					   'width':800,
					   'height':500,
					   seriesType: 'bars',
					   series: {1: {type: 'line'}}};


					   */
		var options = {												  // set the chart options
			title: 'DISTRIBUIÇÃO TRIANGULAR DE PROBABILIDADES',		  // set o título do histograma
			hAxis: {title: "Duração"},			
			series: {
				0: { type: "bars", targetAxisIndex: 0 },
				1: { type: "line", targetAxisIndex: 1}
			},
			vAxes: {
				0: {
					title: 'Frequência absoluta'
				},
				1: {
					title: 'Frequência acumulada (%)'
				}
			}			
		};
		// Instantiate and draw our chart, passing in some options.
		var chart = new google.visualization.ComboChart(document.getElementById('grafico'));
		chart.draw(data, options);
	}
}

function carregaTabela(NumClasses, freqClasses, amplClasse, menor){
	var tabela = [];
	var classeAtual;
	var acumulada = 0;
	
	for(classeAtual = 0; classeAtual < freqClasses.length - 1; classeAtual++){
		acumulada += freqClasses[classeAtual];
		tabela.push([calcLimiteClasse(classeAtual, amplClasse, menor).toFixed(2), 
					freqClasses[classeAtual], 
					100*acumulada/(numbers.length)]);
	}
	acumulada += freqClasses[classeAtual];
	tabela.push(["Outros", 
				freqClasses[classeAtual], 
				100*acumulada/(numbers.length)]);
	
	//console.log("numbers.length : " + numbers.length);
	//console.log("acumulada: " + acumulada);
	
	return tabela;
}

function deleteGrafico(){
    $( "#grafico" ).hide();
} 

function createBar(){
	$( "#data" ).append("<div id='progress'/>");
	$( "#progress" ).append("<p id='descricao'/>");
	$( "#progress" ).append("<div id='progressbar'/>");
}

function updateBar(valor){
	valor = parseInt((100 * valor) / MAX_NUMBERS);
	$( "#progressbar" ).progressbar({
      value: valor
    });
	$("#descricao").text("Carregando números aleatórios a partir do servidor: "+valor+"%");
}

function endBar(){
	$('#progress').hide();
}

function showGrafico(){
	$( "#grafico" ).show();
}

