const Alexa = require('ask-sdk-core');

//現在時間取得
function getDateNow(){
    // 現在時刻の取得
    var dt    = new Date();
    
    // 日本の時間に修正
    dt.setTime(dt.getTime() + 32400000); // 1000 * 60 * 60 * 9(hour)
    
    // 日付を数字として取り出す
    var year  = dt.getFullYear();
    var month = dt.getMonth()+1;
    var day   = dt.getDate();
    var hour  = dt.getHours();
    var min   = dt.getMinutes();
    
    // 値が1桁であれば '0'を追加 
    if (month < 10) {
        month = '0' + month;
    }
    
    if (day   < 10) {
        day   = '0' + day;
    }
    
    if (hour   < 10) {
        hour  = '0' + hour;
    }
    
    if (min   < 10) {
        min   = '0' + min;
    }
    
    // 出力
    var Date_now = year+'年'+month+'月'+day+'日'+hour+'時'+min+'分';
    console.log('Received event:' + Date_now);
    return Date_now;
}

// helpメッセージ
const helpSpeechOutput = 'ベビーレコードの使い方です。次のように話しかけてください。'
    +'授乳の開始時間を記録する場合は、授乳の開始。授乳の終了時間を記録する場合は、授乳の終了、と話しかけてください。'
    +'ミルクを飲んだ量を記録する場合は、ミルクを八十ミリリットル、と話しかけてください。'
    +'体温を記録する場合は、体温は三十七点五度、と話しかけてください。'
    +'うんち、おしっこの時間を記録する場合は、うんち、おしっこ、と話かけると、話しかけた時間が記録されます。'
    +'お散歩、お風呂の時間も記録できます。お散歩、お風呂、と話かけてください。話しかけた時間が記録されます。'
    +'詳細はAlexaアプリで確認できます。それでは、はなしかけてみてください。';

const helpRreprompt = '授乳、ミルク、体温、おしっこ、うんち、と記録したいものをはなしかけてください。';
const helpCardTitle = '＜ベビーレコード：使い方＞';

const helpCardText = '授乳、ミルク、体温、おしっこ、うんち、と話かけてください。授乳は開始時間と終了時間を記録できます。'
    +'ミルクは何ミリリットル飲んだかを記録できます。体温は何度だったかを記録できます。'
    +'うんち、おしっこ、お散歩、お風呂は話しかけた時間を記録します。';

//TODO メッセージの外だし一覧化
//TODO リファクタ。不要・重複コードの削除


// 初期起動
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechOutput = 'ベビーレコードです。記録したい内容を話してください。使い方は、使い方を教えて、と話しかけてください。';
        const reprompt = 'おしっこした、や、うんちの時間を記録、と話しかけてください。使い方は、使い方を教えて、と話しかけてください。';
        return handlerInput.responseBuilder
            .speak(speechOutput)
            .reprompt(reprompt)
            .getResponse();
    }
};

//体温
const TemperatureIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'TemperatureIntent' ||
                handlerInput.requestEnvelope.request.intent.name === 'IntegerIntent' ||
                handlerInput.requestEnvelope.request.intent.name === 'FractionIntent');
    },
    handle(handlerInput) {
        let integer = handlerInput.requestEnvelope.request.intent.slots.Integer.value;
        let fraction = handlerInput.requestEnvelope.request.intent.slots.Fraction.value;

        if(integer === undefined){

            const speechOutput = '体温を記録します。体温は何度でしたか？';
            const reprompt = '体温は何度でしたか？';
            return handlerInput.responseBuilder
            .speak(speechOutput)
            .reprompt(reprompt)
            .getResponse();
        }else{
            var temperature ='';
            if(fraction === undefined){
                temperature = integer;
            }else{
                temperature = integer+'.'+fraction;
            }
            const speechOutput = '体温を'+temperature+'度で記録しました。詳細はAlexaアプリのカードで確認できます。';
            const cardTitle = '＜ベビーレコード：体温＞';
            const cardText = getDateNow() +'の 体温 は'+temperature+'度でした';
            return handlerInput.responseBuilder
            .speak(speechOutput)
            .withSimpleCard(cardTitle, cardText)
            .getResponse();
        }
    }
};

//お散歩
const WalkIntentHandler = {
    canHandle(handlerInput){
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'WalkIntent');
    },
    handle(handlerInput){
        const speechOutput = 'お散歩の時間を記録しました。詳細はAlexaアプリで確認できます。';
        const cardTitle = '＜ベビーレコード：お散歩＞';
        const cardText = getDateNow() +'にお散歩しました';
        return handlerInput.responseBuilder
        .speak(speechOutput)
        .withSimpleCard(cardTitle, cardText)
        .getResponse();
    }
};

//お風呂
const BathIntentHandler = {
    canHandle(handlerInput){
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'BathIntent');
    },
    handle(handlerInput){
        const speechOutput = 'お風呂の時間を記録しました。詳細はAlexaアプリで確認できます。';
        const cardTitle = '＜ベビーレコード：お風呂＞';
        const cardText = getDateNow() +'にお風呂に入りました';
        return handlerInput.responseBuilder
        .speak(speechOutput)
        .withSimpleCard(cardTitle, cardText)
        .getResponse();
    }
};

//使い方
const HowToUseIntentHandler = {
    canHandle(handlerInput){
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'HowToUseIntent');
    },
    handle(handlerInput){
        console.log('HowToUseIntentHandler01');
        
        return handlerInput.responseBuilder
        .speak(helpSpeechOutput)
        .reprompt(helpRreprompt)
        .withSimpleCard(helpCardTitle, helpCardText)
        .getResponse();
    }
};

//授乳の記録
const NurseIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'NurseIntent');
    },
    handle(handlerInput) {
        
        //TODO DB接続の確認
        
        
        //TODO START/ENDのリストを作成して、判定させる
        //     STARTのときはタイマーがあったら確認、なければスタート
        //     ENDの時は、タイマーがあったら終了、なければ確認

        const attributes = handlerInput.attributesManager.getSessionAttributes();
        let start = attributes.start;
        let which = attributes.which;
        if (start === undefined){
            if (handlerInput.requestEnvelope.request.intent.slots.Start) {
                start = handlerInput.requestEnvelope.request.intent.slots.Start.value;
            }
        }
        if (which === undefined){
            if (handlerInput.requestEnvelope.request.intent.slots.Which) {
                which = handlerInput.requestEnvelope.request.intent.slots.Which.value;
            }
        }
        
        let end = handlerInput.requestEnvelope.request.intent.slots.End.value;

        if(start === undefined && end === undefined){
            console.log('MilkIntentHandler04');
            
            if (handlerInput.requestEnvelope.request.intent.slots.Which) {
                attributes.which = handlerInput.requestEnvelope.request.intent.slots.Which.value;
                handlerInput.attributesManager.setSessionAttributes(attributes);
            }

            const speechOutput = '授乳を記録します。授乳開始ですか、授乳完了ですか？';
            const reprompt = '授乳開始ですか、授乳完了ですか？';
            return handlerInput.responseBuilder
            .speak(speechOutput)
            .reprompt(reprompt)
            .getResponse();
        }else if(start === undefined) {
            console.log('MilkIntentHandler05');
            
            if(which === undefined){
                const speechOutput = '授乳が終わりました。詳細はAlexaアプリのカードで確認できます。';
                const cardTitle = '＜ベビーレコード：授乳完了＞';
                const cardText = getDateNow() +'に 授乳 が 終わりました。';
                return handlerInput.responseBuilder
                .speak(speechOutput)
                .withSimpleCard(cardTitle, cardText)
                .getResponse();                
            }else{
                const speechOutput = which+'の授乳が終わりました。詳細はAlexaアプリのカードで確認できます。';
                const cardTitle = '＜ベビーレコード：授乳完了＞';
                const cardText = getDateNow() +'に'+which+'の 授乳 が 終わりました。';
                return handlerInput.responseBuilder
                .speak(speechOutput)
                .withSimpleCard(cardTitle, cardText)
                .getResponse();
            }

        }else if(end === undefined && which === undefined) {
            console.log('MilkIntentHandler06');
            attributes.start = start;
            handlerInput.attributesManager.setSessionAttributes(attributes);

            const speechOutput = '授乳の開始を記録します。右の授乳ですか、左の授乳ですか。';
            const reprompt = '右の授乳ですか、左の授乳ですか。';
            return handlerInput.responseBuilder
            .speak(speechOutput)
            .reprompt(reprompt)
            .getResponse();
        }else if(end === undefined){
            console.log('MilkIntentHandler06');
            const speechOutput = which+'の授乳を開始しました。詳細はAlexaアプリのカードで確認できます。';
            const cardTitle = '＜ベビーレコード：授乳開始＞';
            const cardText = getDateNow() +'に'+which+'の 授乳 を 開始 しました。';
            return handlerInput.responseBuilder
            .speak(speechOutput)
            .withSimpleCard(cardTitle, cardText)
            .getResponse();
        }else {
            //TODO error処理
        }
        
    }
};


//ミルクの記録
const MilkIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'MilkIntent' ||
                handlerInput.requestEnvelope.request.intent.name === 'AmountIntent');
    },
    handle(handlerInput) {
        console.log('MilkIntentHandler01');
        
        let amount = handlerInput.requestEnvelope.request.intent.slots.amount.value;

        if(amount === undefined){
            console.log('MilkIntentHandler04');

            const speechOutput = 'ミルクを記録します。なんミリリットル飲みましたか？';
            const reprompt = 'なんミリリットル飲みましたか？';
            return handlerInput.responseBuilder
            .speak(speechOutput)
            .reprompt(reprompt)
            .getResponse();
        }else{
            console.log('MilkIntentHandler05');
            const speechOutput = 'ミルクを'+amount+'ミリリットルで記録しました。詳細はAlexaアプリのカードで確認できます。';
            const cardTitle = '＜ベビーレコード：ミルク＞';
            const cardText = getDateNow() +'に ミルク を'+amount+'ミリリットル飲みました。';
            return handlerInput.responseBuilder
            .speak(speechOutput)
            .withSimpleCard(cardTitle, cardText)
            .getResponse();
        }
    }
};

//おしっこ&うんちの記録
const PeePooIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'PeePooIntent';
    },
    handle(handlerInput) {
        const attributes = handlerInput.attributesManager.getSessionAttributes();
        
        let quantity = handlerInput.requestEnvelope.request.intent.slots.Quantity.value;
        let poo = handlerInput.requestEnvelope.request.intent.slots.Poo.value;
        let pee = handlerInput.requestEnvelope.request.intent.slots.Pee.value;
        let poopee = attributes.poopee;
        
        if(poopee === undefined){
            if(poo === undefined){
                poopee = 'おしっこ';
                //attributes.pee = pee;
            } else if(pee === undefined){
                poopee = 'うんち';
                //attributes.pee = poo;
            } else {
                //TODO error処理
            }
        }
        
        if(quantity === undefined){
            console.log('PeeIntent01');
            attributes.poopee = poopee;
            handlerInput.attributesManager.setSessionAttributes(attributes);
            
            const speechOutput = poopee+'の時間を記録します。'+poopee+'の量は、多い、普通、少ない、どれくらいでしたか？';
            const reprompt = poopee+'の量は、多い、普通、少ない、どれくらいでしたか？';
            return handlerInput.responseBuilder
            .speak(speechOutput)
            .reprompt(reprompt)
            .getResponse();
        } else{
            console.log('PeeIntent03');
            
            const speechOutput = poopee+'の時間を記録しました。詳細はAlexaアプリのカードで確認できます。今回の'+poopee+'の量は、'+quantity+'、でした';
            const cardTitle = '＜ベビーレコード：'+poopee+'＞';
            const cardText = getDateNow() +'に '+poopee+' をしました。量は '+quantity+' でした';
            
            return handlerInput.responseBuilder
            .speak(speechOutput)
            .withSimpleCard(cardTitle, cardText)
            .getResponse();
        }
    }
};


// TODO YESパターンの実装
const YesIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent';
    },
    handle(handlerInput) {
        const attributes = handlerInput.attributesManager.getSessionAttributes();
        const amount = attributes.amount;
        const menu = attributes.menu;

        const speechOutput = menu + 'を' + amount + 'つ。お砂糖をつけてご用意いたします。ご利用ありがとうございました。';
        return handlerInput.responseBuilder
        .speak(speechOutput)
        .getResponse();
    }
};

// TODO NOパターンの実装
const NoIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NoIntent';
    },
    handle(handlerInput) {
        const attributes = handlerInput.attributesManager.getSessionAttributes();
        const amount = attributes.amount;
        const menu = attributes.menu;

        const speechOutput = menu + 'を' + amount + 'つ。お砂糖なしでご用意いたします。ご利用ありがとうございました。';
        return handlerInput.responseBuilder
        .speak(speechOutput)
        .getResponse();
    }
};


//ヘルプ要求の場合
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        // const speechOutput = 'ベビーレコードです。記録したい内容を話してください。';
        // const reprompt = '記録したい内容を話してください。';
        return handlerInput.responseBuilder
            .speak(helpSpeechOutput)
            .reprompt(helpRreprompt)
            .withSimpleCard(helpCardTitle, helpCardText)
            .getResponse();
    }
};

//キャンセルと停止
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechOutput = 'ベビーレコードを終了しました。ご利用ありがとうございました。';
        return handlerInput.responseBuilder
            .speak(speechOutput)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder.getResponse();
    }
};

// エラー
const ErrorHandler = {
    canHandle () {
      return true;
    },
    handle (handlerInput, error) {
      console.log(`Error handled: ${error.message}`);
      const message = "すみません。うまく聞き取れませんでした。もう一度言ってください。もしうまく行かない場合は、ストップ、と言ってください。";
      return handlerInput.responseBuilder
        .speak(message)
        .reprompt(message)
        .getResponse();
    }
};

const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    NurseIntentHandler,
    MilkIntentHandler,
    PeePooIntentHandler,
    BathIntentHandler,
    WalkIntentHandler,
    TemperatureIntentHandler,
    YesIntentHandler,
    NoIntentHandler,
    HelpIntentHandler,
    HowToUseIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
