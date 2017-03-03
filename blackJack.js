var ifwin = 0;
var bet = 50;
var deck =[];
var dealer = {name: 'dealer', cards: []};
var player = {name: 'player', cash: 100, cards: []};
var pWins = 0;
var dWins = 0;
var pushWins = 0;
var status;	

function startGame() {
	// Блокируем кнопку "New Game"
	setAttrById('start','set','disabled','');
	
	// Проверяем деньги игрока
	if (player.cash <= 0) {
		setHtmlById('statusbar',"Game Over! You have no cash");
		return false;
	}
	
	// Создаем колоду если карт в колоде меньше случайного числа между 90 и 110
	if (deck.length - 1 < getRandomInt(90, 110)) getDeck();
	
	// Вывод сообщения "New Game!"
	setHtmlById('statusbar','New Game!')
	
	// Обнуляем ставку игрока, карты игрока и дилера, блокируем кнопки
	setHtmlById('playersBet', 0);
	
	player.cards = [];
	setHtmlById('playersCards','');
	setHtmlById('playersScore','');
	
	dealer.cards = [];
	setHtmlById('dealersCards','');
	setHtmlById('dealersScore','');
	
	// Игрок делает ставку
	
	do{
		bet = parseInt(prompt('Make your bet (your cash: ' + player.cash + ')', bet));		
	}while(isNaN(bet) || player.cash-bet < 0 || !bet);
	
	player.cash = player.cash - bet;
	ifwin = bet*2;
	
	setHtmlById('playersBet', bet);
	setHtmlById('playersCash', player.cash);
	
	// Раздаются карты
	getCard(player);	
	getCard(dealer);
	getCard(player);
	
	// Проверка на блекджек 
	if (getSum(player) == 21) {
		status = "Player's Blackjack!";
		ifwin = bet*3/2+bet;
		dealerTurn();
		return false;
	}
	
	// Вывод сообщения "Player's pull" и разблокировка кнопок "More Card" и "Stay"
	setHtmlById('statusbar',"Player's pull");
	setAttrById('morecard','remove','disabled');
	setAttrById('next','remove','disabled')
}

function moreCard() {
	getCard(player);
	
	if (getSum(player) == 21) {
        status += "Player's Blackjack!";
        ifwin = bet*3/2+bet;
        dealerTurn();
        return false;
	} else if (getSum(player) > 21) { 
		endGame();
		return false;
    }
};

function dealerTurn() {
	
	setAttrById('morecard','set','disabled');
    setAttrById('next','set','disabled');
	setHtmlById('statusbar', "Dealer turn" + status);

	var timerId = setInterval(function() {
	
		if (getSum(dealer) < 17) {
	            
            getCard(dealer);
            
            if (getSum(dealer) == 21) {
				status += 'Dealer Blackjack!';
				clearInterval(timerId);
				endGame();
		    } else if (getSum(dealer) > 21) { 
				clearInterval(timerId);
				endGame();
			}
		} else {
			clearInterval(timerId);
			endGame();
		}  
	}, 1000);			
}	

function endGame(){
	
	setAttrById('morecard', 'set', 'disabled', '');
    setAttrById('next', 'set', 'disabled', '');
		
	if ((getSum(dealer) > getSum(player) && getSum(dealer) <= 21) 
	  || getSum(player) > 21) {
	    setHtmlById('statusbar', "Dealer WINNER! " + status);
	    dWins++;
	} else if ((getSum(dealer) < getSum(player) && getSum(player) <= 21) 
	  || getSum(dealer) > 21) {
	    setHtmlById('statusbar', "Player WINNER! " + status);
	    player.cash = player.cash + ifwin;
	    setHtmlById('playersCash',player.cash);
	    pWins++
	} else if (getSum(player) == getSum(dealer)) {
	    setHtmlById('statusbar',"Push! Nobody WINNER!");
	    player.cash = player.cash + bet;
	    setHtmlById('playersCash', player.cash);
	    pushWins++;
	}
	
	status = '';
	getById('totalScore').innerHTML = '<p>' + 'WINS' + '</p><p>' + 'Dealer - ' + dWins + '</p><p>' + 'Players - ' + pWins + '</p><p>' + 'Pushes - ' + pushWins + '</p>';
	
	if(player.cash <= 0){
		setHtmlById('statusbar','Game Over! You have no cash');
		return false;
	}
	
	setAttrById('start','remove','disabled');
	
}




function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getById(elem) {
	return document.getElementById(elem);
}

function setHtmlById(elem, val) {
	return getById(elem).innerHTML = val;
}

function setAttrById(elem, o, att, val) {
	switch (o) {
		case 'set':
			return getById(elem).setAttribute(att,val);
			break;
		case 'remove':
			return getById(elem).removeAttribute(att);
			break;
		default:
			alert('Я таких значений не знаю');
	}
}

// Функция для создания новой колоды карт
function getDeck() {
	deck = [];
	
	var suit = ['&spades;','&clubs;','&diams;','&hearts;'];
	var val = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
	
	for (var i = 0; i <= 5; i++) {
		for (var ii = 0; ii <= suit.length-1; ii++) {
			for (var iii = 0; iii <= val.length-1; iii++) {
				deck.push({s:suit[ii], v:val[iii]})
			}
		}	
	}

	return deck;
}

function getCard(arr, random) {
	
	if(random == 'no'){
		var deckCardArr = deck.splice(0,1);	
	} else {
		var deckCardArr = deck.splice(getRandomInt(0, deck.length-1),1);
	}
	var arrCards = arr.cards;
	
	arrCards.push(deckCardArr[0]);
	 
	var c = getById(arr.name+'sCards');
    var d = document.createElement('div');
	
	var suitCount;
	
	if (arrCards[arrCards.length-1].v == 'J' || arrCards[arrCards.length-1].v == 'Q' || arrCards[arrCards.length-1].v == 'K' || arrCards[arrCards.length-1].v == 'A') {
		suitCount = 1;
	} else {
		suitCount = arrCards[arrCards.length-1].v;
	}
	
	var suits = '';
	
	for (var i = 1; i <= suitCount; i++) {
		
		suits = suits + '<div class="cardInsideSuit '+arrCards[arrCards.length-1].v+'card" style="height:'+100/arrCards[arrCards.length-1].v+'%; line-height:'+100/arrCards[arrCards.length-1].v+'px;">' + arrCards[arrCards.length-1].s+'</div>';
		
	}
	
    d.className = 'card';
    d.innerHTML = '<div class="cardSuit">' + arrCards[arrCards.length-1].v + '<br/>'  + arrCards[arrCards.length-1].s + '</div><div class="cardInside">' + suits +'</div><div class="cardSuit">' + arrCards[arrCards.length-1].v + '<br/>'  + arrCards[arrCards.length-1].s + '</div> ';
    
    c.appendChild(d);
    
    setHtmlById(arr.name+'sScore',getSum(arr)); 
}

function getSum(arr){
	
	var sum = 0;
	for (var i = 0; i < arr.cards.length; i++) {
		var card = arr.cards[i].v;
		if (card != 'A') {
			if (card == 'J' || card == 'Q' || card == 'K') {
		    	sum += 10;
			} else {
		    	sum += parseInt(card);
			}
		}
	}
	for(var i = 0; i < arr.cards.length; i++){
		var card = arr.cards[i].v
		if (card == 'A') { 
			if (sum > 10) {
				sum += 1;
			} else {
				sum += 11;
			}
		}
	}
return sum;
}
