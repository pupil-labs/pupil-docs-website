# pupil-docs-website

**Warning**: Depreciated on 2019-09-30. Now all docs and site generator are in [pupil-docs](https://github.com/pupil-labs/pupil-docs "pupil-docs repo").

---

Pupil docs static site generator. 

## Dependencies & Setup

- `hugo` - static site generator written in `Go`
  - macOS: `brew install hugo`
  - Linux: `sudo apt install hugo` or `snap install hugo`
  - Windows: see hugo installation guide [here](https://gohugo.io/overview/installing/)
- `Pygments`
  - `pip install pygments` or `pip3 install pygments`
- `Node` and `npm`

Clone the repo and submodules:

`git clone --recursive https://github.com/pupil-labs/pupil-docs-website.git`

### Install node dependencies

```bash
cd pupil-docs-website
npm install
```

## Preview

Build and serve using gulp tasks. This will call `hugo server` as a child process after building all js and css.

```bash
gulp
```

By default this will serve on `localhost:1313`

## Project structure

This project depends on 3 submodules:

  - [content](https://github.com/pupil-labs/pupil-docs) - contains all text and images used in documentation. It is versioned independently from the site generator and all styles. Versions of content are synchronized with versions of [Pupil](https://github.com/pupil-labs/pupil). 
  - [docuapi](https://github.com/pupil-labs/docuapi) - a Hugo theme for slate with some nice custom tools. We forked the repo in order to make change to layouts and styles. 
  	- [slate](https://github.com/pupil-labs/slate) - a fork of Slate with only `js`, styles, and fonts stored for development. Javascript is minified and bundled with `docuapi`'s custom GO bundler or with `gulp` task.  

Diagram of the submodule hierarchy.

```
/pupil-docs-website
|-- content
|-- themes
|	`-- docuapi
|		`--static
|			`--slate
```

## Deployment

Deployment with TravisCI. See `.travis.yml` and `/scripts` directory. 

## HTML Proofer

[HTMLProofer](https://github.com/gjtorikian/html-proofer) - test rendered html files for errors

Have a look in [Pupil Docs Wesite TravisCI](https://travis-ci.org/pupil-labs/pupil-docs-website) logs for errors

### What's Tested?

- Images - `img` elements
- Links - `a`, `link` elements
- Scripts - `script` elements
- HTML - Whether the HTML markup is valid. This is done via [Nokogiri](http://www.nokogiri.org/tutorials/ensuring_well_formed_markup.html) to ensure well-formed markup.

### Installation

`bundle install`

## Notes

Setup `$GOPATH` on [Arch Linux](https://wiki.archlinux.org/index.php/Go#.24GOPATH)
SSL with letsencrypt - [3rd party tool](https://gethttpsforfree.com)

