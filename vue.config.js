/**
 * Ici se trouve la configuration de l'application
 * @type {{devServer: {port: number}, transpileDependencies: string[]}}
 */
module.exports = {
  transpileDependencies: [
    'vuetify'
  ],

  devServer: {
    port: 8081
  }
}
