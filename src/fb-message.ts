// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const delay = async ms => new Promise(resolve => setTimeout(resolve, ms))

export default class Message {
  public listenForMessages (api): void {
    api.listenMqtt(async (error_, event) => {
      if (event.type !== 'message') return
      if (event.isGroup === true) return

      const MESSAGE_TIMEOUT = 1500

      if (event.attachments[0]?.type === 'photo') {
        api.sendMessage(event.attachments[0].previewUrl, event.threadID)
      } else {
        await delay(MESSAGE_TIMEOUT)
        api.markAsRead(event.threadID)

        await delay(MESSAGE_TIMEOUT)
        api.sendTypingIndicator(event.threadID)

        await delay(MESSAGE_TIMEOUT)
        api.sendMessage(event.body, event.threadID)
      }
    })
  }
}
