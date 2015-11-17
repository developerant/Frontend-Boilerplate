Architect Front-end Boilerplate
===============================

A starting point for Architect front-end projects.

## Installation:

- Download and unzip into project directory
`wget https://github.com/wearearchitect/Frontend-Boilerplate/archive/master.zip`
- run `npm install`
- run `bundle`
- Away you go…

## Gulp

The standard build tool we’re now using is Gulp. In the `gulpfile`, plugins are loaded with `gulp-load-plugins` so should be used with the `$.` prefix.

Primary Tasks:

- `gulp` - runs all tasks (use in dev)
- `gulp --production` - runs all production tasks (i.e excludes `devDependencies` )

### The SVG Icon System

The default `gulp` task includes the `svgstore`, `inject` and `svgfallback` tasks. Together, they will create an SVG icon system that will work in IE8 and up.

SVG files added to `assets/img/svg` will be optimised and added to a `svg.svg` file found in `public/_img/svg`. The content of this file (a block of svg symbols) is then auto-injected into your document just after the opening `<body>` tag.

You're then free to use your icons like this:

```
<svg class="icon">
	<use xlink:href="#cross"></use>
</svg>
```

They can then be styled with all the CSS you desire. Each individual svg is also piped through to the `public` folder. This enables you to use each svg via the `use` method above (highly recommended) or via all the other ways of displaying svgs on the web (see the links below).

NB: Browser support is solid and this system will work in IE9 and up. A few adjustments need to be made for IE8 - having run `gulp` you'll find an auto-generated sprite in `public_img/png/sprite` along with a css file that can be used in conjunction with background images and the Modernizr fallback example found in `svg-ie8.scss`.

Further reading:

- [A Compendium Of SVG Information](https://css-tricks.com/mega-list-svg-information/)
- [Accessible SVG](https://developers.google.com/web/starter-kit)
- [SVG vs. Icon Fonts](https://css-tricks.com/icon-fonts-vs-svg/)
- [An Overview of SVG Sprite Creation Techniques](http://24ways.org/2014/an-overview-of-svg-sprite-creation-techniques/)
- [Ten Reasons We Switched From An Icon Font to SVG](http://ianfeather.co.uk/ten-reasons-we-switched-from-an-icon-font-to-svg/)

## Structure

The main directory is `assets` that contains all the styles, scripts, and images used to create the front-end. The `assets` directory structure is:

```
assets/
|- img/           # use appropriate sub-folders
|- js/
|  |- vendor/
|  `- src/
|     `- core.js
`- scss/
|  |- base/
|  |- components/
|  |- pages/
|  |- patterns/
|  |- sections/
|  |- settings/
|  |- tools/
|  |- vendor/
   |- print.scss
   |- ie.scss     # IE stylesheet based on main.scss
   `- main.scss   # Main manifest file
```

Files are by default output to the `public` directory in the following folder structure:

```
public/
|- img/     # matches assets directory structure
|- _js/
|- _css/
```

However the output directories can be changed based on the specific project using the `paths` object at the top of the `gruntfile`:

```
paths = {
	scss: 'assets/scss/*.scss',
	js: 'assets/js/*.js',
	img: 'assets/img/*'
}
```

### Sass structure

The base structure of the Sass directory should remain, whether being used or not.

_NOTE: Rendering and non-rendering Sass should remain separate, see this post for more information: https://robots.thoughtbot.com/separate-rendering-sass-from-non-rendering-sass_

Non-rendering Sass should be placed in the following folders:
- tools
- settings
- patterns

Rendering Sass should go in the remaining folders:
- base
- components
- pages
- sections
- vendor

### Sub-folders

The use of sub-folders is encouraged to further break down related files.

In JavaScript a sub-folder of `modules` inside of  the `src` folder would be good practice to break down any smaller functionality that is used by the files in the `src` folder.

In Sass, sub-folders are encouraged to keep partial size down and keep related styles together. When creating a sub-folder within one of the main Sass folders, also create a manifest partial of the same name to include the partials contained within. For example, in the following file structure:

```
components/
|- forms/
   |- _select.scss
   |- _radio.scss
   |- _checkbox.scss
|- _forms.scss
```

The `_forms.scss` partial, should contain the manifest for the forms folder:

```
@import 'forms/select';
@import 'forms/radio';
@import 'forms/checkbox';
```

## License

GPL2
