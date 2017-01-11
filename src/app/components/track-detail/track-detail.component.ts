import {
  Component,
  OnInit,
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/core';
import {TrackDetailsState} from '../../reducers/track-details.reducer';

import { ChangeDetectionStrategy } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser';
import { SoundCloudService } from './../../services/soundcloud.service';
import { Store } from '@ngrx/store';
import { AppStore } from './../../models/appstore.model';
import { Track } from './../../models/track.model';
import { TrackActions } from './../../actions/track.actions';
import { TracksState } from './../../reducers/tracks.reducer';
import { PlayerState } from './../../reducers/player.reducer';
import { Observable } from 'rxjs/Observable';
import { AudioStream } from '../../audio-element';
import { Subscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute, Params } from '@angular/router';


@Component({
  selector: 'track-detail',
  templateUrl: 'track-detail.component.html',
  styleUrls: ['track-detail.component.css']
})
export class TrackDetailComponent implements OnInit {
 constructor(
    private store$: Store<AppStore>,
    private soundCloudService: SoundCloudService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private trackActions: TrackActions
  ) {
  }
  currentlyPlaying$: Observable<boolean>;
  trackDetails$: Observable<TrackDetailsState>;
  license: string;
  description: string;
  imgUrl: string;
  waveformUrl: string;
  track: Track;
  youtubeId$: Observable<string>;
  created: string;

  licenses: {} = {
    'no-rights-reserved': 'No rights reserved',
    'all-rights-reserved': 'All rights reserved',
    'cc-by': 'CC BY',
    'cc-by-nc': 'CC BY NC',
    'cc-by-nd': 'CC BY ND',
    'cc-by-sa': 'CC BY SA',
    'cc-by-nc-nd': 'CC BY NC ND',
    'cc-by-nc-sa': 'CC BY NC SA'
  };

  ngOnInit() {
    let trackId = this.route.snapshot.params['trackId'];
    this.soundCloudService.loadTrackDetails(trackId);
    this.trackDetails$ = this.store$.select(s => s.trackDetails);
    this.trackDetails$.subscribe(item => {
      this.description = item.description;
      this.license = this.licenses[item.license] ? this.licenses[item.license] : item.license;
      this.imgUrl = item.track.imgUrl;
      this.waveformUrl = item.waveformUrl;
      this.track = item.track;
      this.created = item.created;
      this.youtubeId$ = this.soundCloudService.searchYoutubeVideo(this.track.title + ' ' + this.track.artist);
    });
    this.currentlyPlaying$ = this.store$.select(s => s.player)
      .map((playerStatus: PlayerState) => playerStatus.isPlaying && playerStatus.currentTrack.id === this.track.id);
  }

  clickHandler() {
    this.store$.dispatch(this.trackActions.togglePlayPause(this.track));
  }

}