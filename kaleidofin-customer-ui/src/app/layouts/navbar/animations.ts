import {
  animate, state,
  style,
  transition, trigger
} from "@angular/animations";

export const onSideNavChange = trigger("onSideNavChange", [
  state(
    "close",
    style({
      "min-width": "80px"
    })
  ),
  state(
    "open",
    style({
      "min-width": "245px"
    })
  ),
  transition("close => open", animate("250ms ease-in")),
  transition("open => close", animate("250ms ease-in"))
]);

export const onMainContentChange = trigger("onMainContentChange", [
  state(
    "close",
    style({
      "margin-left": "80px"
    })
  ),
  state(
    "open",
    style({
      "margin-left": "245px"
    })
  ),
  transition("close => open", animate("250ms ease-in")),
  transition("open => close", animate("250ms ease-in"))
]);

export const animateText = trigger("animateText", [
  state(
    "hide",
    style({
      display: "none",
      opacity: 0
    })
  ),
  state(
    "show",
    style({
      display: "block",
      opacity: 1
    })
  ),
  transition("close => open", animate("200ms ease-in")),
  transition("open => close", animate("200ms ease-out"))
]);
