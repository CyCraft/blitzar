### Row Hover Color

As you can see in the example above, to modify the row hover color, you need to disable the default background on `td:before` and then set your color on `tr:hover` like so:

```css
td:before
  background: none !important
tr:hover
  background: var(--my-awesome-color)
```
