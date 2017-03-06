# pupil-docs-website

pupil docs static site generator

## Dependencies & Setup

- `hugo` - static site generator written in `Go`
  - macOS: `brew install hugo`
  - Linux: `snap install hugo`
  - Windows: see hugo installation guide [here](https://gohugo.io/overview/installing/)
- `Pygments`
  - `pip install pygments` or `pip3 install pygments`

Clone the repo and submodules:

`git clone --recursive https://github.com/pupil-labs/pupil-docs-website.git`

## Preview site on local server

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

## Content

All text and image content are stored in the `content` directory. `content` is a submodule with repo at [pupil-docs](https://github.com/pupil-labs/pupil-docs). 

All content is written in markdown.