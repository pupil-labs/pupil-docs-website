
module.exports = {
  title: "Pupil Labs",
  description: "Pupil Labs - We build state of the art eye tracking hardware and software. \
                We work hard to bring research ideas out of the lab and into the real world.",
  themeConfig: {
    displayAllHeaders: true,
    lastUpdated: "Last Updated",
    sidebar:{
      '/invisible/':[
        {
          title: 'Introduction',
          children: [
            '',
          ]
        },
        {
          title: 'Getting Started',
          children: [
            ['getting-started/','test'],
            'getting-started/capture-walkthrough',
            'getting-started/capture-workflow',
            'getting-started/player-walkthrough',
            'getting-started/player-workflow',
          ]
        },
        {
          title: 'Hardware',
          children: [
            'pupil-hardware/',
            'pupil-hardware/hardware-dev',
            'pupil-hardware/hololens-add-on',
            'pupil-hardware/htc-vive-add-on',
            'pupil-hardware/oculus-dk2-add-on',
            'pupil-hardware/pupil-diy',
            'pupil-hardware/pupil-headset',
          ]
        },
        {
          title: 'License',
          collapsable: true,
          children: [
            '',
          ]
        },
      ],
      '/core/':[
        {
          title: 'Introduction',
          children: [
            '',
          ]
        },
      ],
      '/vr-ar/':[],
      '/cloud/':[],
      '/developer/':[],
    },
    sidebarDepth: 3,
    displayAllHeaders: true,

    lastUpdated: 'Last Updated',
    repo: 'https://github.com/pupil-labs/pupil-docs-website',
    repoLabel: 'See on Github',
    docsRepo: 'https://github.com/pupil-labs/pupil-docs',
    docsDir: 'src',
    docsBranch: 'vuepress-refactor',
    editLinks: true,
    editLinkText: 'Edit this page!'
  },

  plugins: [

  ],


}