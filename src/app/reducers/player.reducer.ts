import { Action } from '@ngrx/store';

import { Player } from '../models/player.model';
import { PlayerActions } from '../actions/player.actions';
import { TrackActions } from '../actions/track.actions';

export type PlayerState = Player;

const initialState: PlayerState = {
  isPlaying: false,
  // currentTime: 0,
  // millisecondProgressWhenStartedPlaying: 0,
  // timestampWhenStartedPlaying: Date.now(),
  currentTrack: {
    id: 0,
    title: '',
    artist: '',
    imgUrl: '',
    streamUrl: '',
    duration: 0
  },
  volume: 50,

  isMuted: false,
  volumeBeforeMute: 5,

  repeatTrack: false,
  shuffleTracks: false,
  bufferedRanges: [],
  showVisualization: false
};

export default function (state = initialState, action: Action): PlayerState {
  switch (action.type) {

    case TrackActions.TOGGLE_PLAY_PAUSE: {
      // Pause Track because we clicked the track that was already playing.
      if (state.currentTrack.id === action.payload.id) {
         return Object.assign({}, state, {
          isPlaying: !state.isPlaying,
        });
      } else {  // Change Track and keep playing.
        return Object.assign({}, state, {
          isPlaying: true,
          currentTrack: action.payload
        });
      }
    }

    case PlayerActions.TOGGLE_PLAY_PAUSE:  {
      return Object.assign({}, state, {
          isPlaying: !state.isPlaying,
      });
    }

    case PlayerActions.VOLUME_CHANGE: {
      if (state.isMuted) {
        return Object.assign({}, state, {
          volume: state.volumeBeforeMute,
          isMuted: !state.isMuted,
        });
      } else {
        if (action.payload.volume === 0) {
          return Object.assign({}, state, {
            volumeBeforeMute: 10,
            volume: action.payload.volume,
            isMuted: !state.isMuted,
          });
        } else {
          return Object.assign({}, state, {
            volume: action.payload.volume,
          });
        }
      }
    }

    case PlayerActions.VOLUME_MUTE_TOGGLE: {
      if (state.isMuted) {
        return Object.assign({}, state, {
          volume: state.volumeBeforeMute,
          isMuted: !state.isMuted,
        });
      } else {
        return Object.assign({}, state, {
          volumeBeforeMute: action.payload.volume,
          volume: 0,
          isMuted: !state.isMuted,
        });
      }
    }

    case PlayerActions.JUMP_TO_NEXT: {
      return Object.assign({}, state, {
        currentTrack: action.payload,
        isPlaying: true
      });
    }

    case PlayerActions.JUMP_TO_PREVIOUS: {
      return Object.assign({}, state, {
        currentTrack: action.payload,
        isPlaying: true
      });
    }

/*
    case PlayerActions.UPDATE_CURRENT_TIME: {
      return Object.assign({}, state, {
        currentTime: action.payload
      });
    }
    */

    case PlayerActions.TOGGLE_REPEAT: {
      return Object.assign({}, state, {
        repeatTrack: !state.repeatTrack,
      });
    }

    case PlayerActions.TOGGLE_SHUFFLE: {
      return Object.assign({}, state, {
        shuffleTracks: !state.shuffleTracks,
      });
    }

    case PlayerActions.TOGGLE_VISUALIZATION: {
      return Object.assign({}, state, {
        showVisualization: !state.showVisualization,
      });
    }

    case PlayerActions.SET_BUFFERED_RANGES: {
      return Object.assign({}, state, {
        bufferedRanges: action.payload
      });
    }

    case PlayerActions.START_AUDIO_PLAYING: {
      // console.log(action.payload);
      return Object.assign({}, state, {
        millisecondProgressWhenStartedPlaying: action.payload.millisecondProgressWhenStartedPlaying,
        timestampWhenStartedPlaying: action.payload.timestampWhenStartedPlaying
      });
    }

    default: {
      return state;
    }
  }
}
