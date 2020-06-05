
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
// const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList
// const SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent

if (!SpeechRecognition) {
  // uh shit browser doesn't support speech, do things here
  // alert('Oh No - browser is not supporting speech recognition')
}

const recognition = null
if (SpeechRecognition)
{
  const recognition = new SpeechRecognition()

  recognition.lang = 'en-US'
  recognition.interimResults = false
  recognition.maxAlternatives = 1

}

const state =  {
  counter: 0,
  intent: 'None',
  intensity: 'None',
  utterance: '',
  score: 0,
  // idle - awaiting user input
  // listening - listening to user input
  // fetching - fetching user data from the API
  uiState: 'idle',
  zoom: 3
}

const getters = {
    intentStr: state => {
      var str = state.intent
      str = str.replace(/\b(App.)\b/gi, '')
      return str
    },
    intensityStr: state => {
      var str = state.intensity
      str = str.replace(/\b(Intensity.)\b/gi, '')
      return str
    }
}

const mutations = 
{
  newIntent: (state, { intent, score }) => {
    if (intent.includes('Intensity')) {
      state.intensity = intent
      if (intent.includes('More')) {
        state.counter++
      } else if (intent.includes('Less')) {
        state.counter--
      }
    } else {
      state.intent = intent
    }
    state.score = score
  },
  setUiState: (state, status) => {
    state.uiState = status
  },
  setIntent: (state, status) => {
    state.intent = status
  },
  setUtterance: (state, status) => {
    state.utterance = status
  },
  abortRecording: state => {
    recognition.abort()
    state.uiState = 'idle'
  },
  // setZoom: state => {
    
  // }
}

const actions = {
    getSpeech({ dispatch, commit, state }) {
      commit('setUiState', 'listening')
      commit('setUtterance', 'Hi, go ahead ask me something...')

      //keep recording speech all the time or activate it- for the first screen no, press a button. second screen yes.
      state.intent === 'None'
        ? (recognition.continuous = true)
        : (recognition.continuous = false)

      recognition.start()

      recognition.onresult = function(event) {
        const last = event.results.length - 1
        const phrase = event.results[last][0].transcript
        dispatch('getUnderstanding', phrase)
      }
    },

    getUnderstanding({ commit }, utterance) {
        commit('setUtterance',utterance)
      //commit('setUiState', 'fetching')
      /*commit('newIntent', {
        intent: altMaps['call'],
        score: 1
      })*/
     /* const url = `https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/4aba2274-c5df-4b0d-8ff7-57658254d042`

      https: axios({ 
        method: 'get',
        url,
        params: {
          verbose: true,
          timezoneOffset: 0,
          q: utterance
        },
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': '6c85f08d11e84b59b655b8a919b9e286'
        }
      })
        .then(({ data }) => {
          console.log('axios result', data)
          if (altMaps.hasOwnProperty(data.query)) {
            commit('newIntent', {
              intent: altMaps[data.query],
              score: 1
            })
          } else {
            commit('newIntent', data.topScoringIntent)
          }
          commit('setUiState', 'idle')
          commit('setZoom')
        })
        .catch(err => {
          console.error('axios error', err)
        })*/
    }
}

// if it keeps thinking you're saying something else, add here:
// we don't want to do it in Luis if the meaning is much different
// because it will learn the wrong thing.
// const altMaps = {
//   gypsy: 'App.Tipsy',
//   call: 'App.Calm',
//   Les: 'Intensity.Less',
//   bus: 'Intensity.Less',
//   Bus: 'Intensity.Less',
//   plus: 'Intensity.Less',
//   Plus: 'Intensity.Less',
//   last: 'Intensity.Less',
//   Last: 'Intensity.Less',
//   Rush: 'Intensity.Less',
//   bless: 'Intensity.Less',
//   Bless: 'Intensity.Less',
//   Bess: 'Intensity.Less',
//   bess: 'Intensity.Less',
//   best: 'Intensity.Less',
//   birth: 'Intensity.Less',
//   love: 'Intensity.Less',
//   plus: 'Intensity.Less',
//   glad: 'Intensity.Less',
//   louis: 'Intensity.Less',
//   glass: 'Intensity.Less',
//   let: 'Intensity.Less',
//   lek: 'Intensity.Less',
//   lek: 'Intensity.Less',
//   west: 'Intensity.Less',
//   West: 'Intensity.Less',
//   ad: 'Intensity.More',
//   mall: 'Intensity.More',
//   mirrors: 'App.Nervous',
//   hobby: 'App.Happy',
//   heavy: 'App.Happy',
//   faded: 'App.Excited',
//   phelan: 'App.Excited',
//   home: 'App.Calm',
//   call: 'App.Calm',
//   hull: 'App.Calm',
//   paris: 'App.Nervous',
//   Paris: 'App.Nervous',
//   nurse: 'App.Nervous',
//   tipton: 'App.Tipsy'
// },

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}