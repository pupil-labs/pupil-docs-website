# pupil-docs-website

Pupil docs static site generator. 

## Dependencies & Setup

- `hugo` - static site generator written in `Go`
  - macOS: `brew install hugo`
  - Linux: `snap install hugo`
  - Windows: see hugo installation guide [here](https://gohugo.io/overview/installing/)
- `Pygments`
  - `pip install pygments` or `pip3 install pygments`

Clone the repo and submodules:

`git clone --recursive https://github.com/pupil-labs/pupil-docs-website.git`

## Preview

Build and serve only published content

```bash
hugo server
```

Build and serve published content and drafts

```bash
hugo server -D
```

Serve on custom port
```
hugo server -p 3030
```

See server options in hugo docs [here](https://gohugo.io/commands/hugo_server/).

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
```

## Deployment

Deployment with TravisCI. See `.travis.yml` and `/scripts` directory. 
