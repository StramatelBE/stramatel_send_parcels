import { Extension } from '@tiptap/core'
// Nous ne devons pas importer TextStyle ici car il sera fourni par l'éditeur principal
// import TextStyle from '@tiptap/extension-text-style'

export default Extension.create({
  name: 'fontFamily',

  addOptions() {
    return {
      types: ['textStyle'],
      defaultFont: 'Arial',
    }
  },

  // Suppression de la méthode addExtensions pour éviter la duplication
  // addExtensions() {
  //   return [
  //     TextStyle
  //   ]
  // },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontFamily: {
            default: this.options.defaultFont,
            parseHTML: element => {
              return element.style.fontFamily?.replace(/['"]/g, '') || this.options.defaultFont
            },
            renderHTML: attributes => {
              if (!attributes.fontFamily || attributes.fontFamily === this.options.defaultFont) {
                return {}
              }
              return {
                style: `font-family: ${attributes.fontFamily}`,
              }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setFontFamily: fontFamily => ({ chain }) => {
        if (!fontFamily || fontFamily === this.options.defaultFont) {
          return chain().unsetMark('textStyle').run()
        }
        return chain()
          .setMark('textStyle', { fontFamily })
          .run()
      },
      unsetFontFamily: () => ({ chain }) => {
        return chain()
          .unsetMark('textStyle')
          .run()
      },
    }
  },
}) 