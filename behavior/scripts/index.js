'use strict'

exports.handle = function handle(client) {
  const sayHello = client.createStep({
    satisfied() {
      return Boolean(client.getConversationState().helloSent)
    },

    prompt() {
      client.addResponse('app:response:name:welcome')
      client.done()
    }
  })

  const provideGameTime = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addResponse('app:response:name:provide/game_time', {
        'time/game': '6:05 pm CDT',
        'team/opponent': 'Pirates',
      })
      client.done()
    }
  })

  const provideGameResults = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      console.log('>>>>>>>>>>>')
      client.addResponse('app:response:name:provide/game_result', {
        'team/opponent': 'Pittsburgh Pirates',
        'game_score': '12-2',
      })
      client.done()
    }
  })

  const untrained = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addTextResponse('Over my head...can you try again?')
      client.done()
    }
  })

  client.runFlow({
    classifications: {
			// map inbound message classifications to names of streams
      'request/game_time': 'provideCubsGameInfo',
      'request/game_result': 'provideCubsGameInfo',
    },
    autoResponses: {
      // configure responses to be automatically sent as predicted by the machine learning model
    },
    streams: {
      main: 'onboarding',
      provideCubsGameInfo: [provideGameTime, provideGameResults],
      onboarding: [sayHello],
      end: [untrained]
    }
  })
}
