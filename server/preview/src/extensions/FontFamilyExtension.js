import { Extension } from '@tiptap/core'
// Nous ne devons pas importer TextStyle ici car il sera fourni par l'éditeur principal
// import TextStyle from '@tiptap/extension-text-style'

export default Extension.create({
  name: 'fontFamily',

  addOptions() {
    return {
      types: ['textStyle'],
      defaultFont: '"Arial", sans-serif',
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
              // Récupérer la valeur de font-family depuis le style
              const fontFamily = element.style.fontFamily;
              if (!fontFamily) return this.options.defaultFont;

              // Nous prenons la valeur telle quelle, car nous utilisons maintenant
              // des piles de polices complètes (avec guillemets et virgules)
              return fontFamily;
            },
            renderHTML: attributes => {
              if (!attributes.fontFamily) {
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
        if (!fontFamily) {
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