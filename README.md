Bracer
======

Bracer is a simple grunt task which lets you render and compile
mustache and handlebar templates.

You can define data sources, partial directories, and helper files.

For each target, you can also define local partials and data.
This is helpful if your project is module based, and each template is contained in a component folder.
Local partials and data will be resolved relative to each template, and takes precedence during lookup.
In context creation, this means local scopes will override global properties.

## Options

### partials

Type: `String`
Default: `""`

A directory path where partials will be resolved globally.

### localPartials

Type: `String`
Default: `""`

A target specific option. A path fragment for a directory.
This will be concatenated to the currently processed templates directory name,
and partials for that template will be first looked up here.

### data

Type: `String`
Default: `""`

A globbing pattern for `.json` files.
Every file will be placed on an object that will represent the global rendering context.
Their file names will be property keys, and their value will be the parsed content.

### localData

Type: `String`
Default: `""`

A globbing pattern fragment. This will be concatenated to the currently processed
template's directory name, and executed. The resulting data object then will be merged
with the global context. This merged context will be passed to the renderer.

### helpers

Type: `String`
Default: `""`

A globbing patter for `.js` files.
These files will be `require()`-d and executed with two arguments like this:

```js
require(helper)(global, grunt)
```

In the js file, you can then attach helpers to the global scope to use in templates.
You can also use grunt's static methods from the second argument.



## Install

    npm install bracer --save-dev

## Grunt task

    grunt.loadNpmTasks('grunt-bracer');

## Usage

```js
grunt.initConfig({
  bracer: {
    options: {
      partials: "test/global/partials/",
      data: "test/global/data/*.json",
      helpers: "test/global/helpers/*.js"
    },
    render: {
      options: {
        localPartials: "partials/",
        localData: "data/*.json"
      },
      expand: true,
      cwd: "test/template/",
      src: "*.mustache",
      dest: "test/rendered/",
      ext: ".html"
    }
  }
})
```