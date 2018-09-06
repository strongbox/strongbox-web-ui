import {animate, keyframes, state, style, transition, trigger} from '@angular/animations';

export const SIMPLE_FADE_IN_OUT = trigger('fadeInOut', [
    state('*', style({'overflow-y': 'hidden'})),
    state('void', style({'overflow-y': 'hidden'})),
    transition('* => void', [
        style({opacity: '1'}),
        animate(200, style({opacity: 0}))
    ]),
    transition('void => *', [
        style({opacity: '0'}),
        animate(250, style({opacity: 1}))
    ])
]);

export const FADE_IN_OUT_OVERLAP = trigger('fadeInOutOverlap', [
    // Default state
    state('*', style({opacity: 1, display: 'block', transform: 'none'})),
    // State, when removed / hidden.
    state('void', style({opacity: 0})),

    transition('void => *', animate('250ms cubic-bezier(.47,-0.03,.03,.79)', keyframes([
        style({transform: 'translateY(-80%)', opacity: 0, display: 'block', offset: 0}),
        style({transform: 'translateY(-15%)', opacity: 0.1, offset: 0.7}),
        style({transform: 'translateY(-2%)', opacity: 0.7, offset: 0.9}),
        style({transform: 'translateY(0%)', opacity: 1, offset: 1})
    ]))),

    transition('* => void', animate('300ms cubic-bezier(.47,-0.03,.03,.79)', keyframes([
        style({transform: 'translateY(0%)', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.2, offset: 0}),
        style({transform: 'translateY(80%) scale(3.0)', opacity: 0, offset: 0.999999}),
        style({transform: 'none', position: 'inherit', opacity: 1, display: 'none', offset: 1})
    ])))

]);

export const FADE_OUT = trigger('fadeOut', [
    transition('* => void', animate('0.2s cubic-bezier(.47,-0.03,.03,.79)', style({opacity: 0}))),
]);
