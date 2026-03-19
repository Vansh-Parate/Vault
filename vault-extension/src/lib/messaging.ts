import type { Message } from '../types'

export const sendMessage = (message: Message): Promise<any> => {
  return chrome.runtime.sendMessage(message)
}

export const sendToTab = async (tabId: number, message: Message): Promise<any> => {
  return chrome.tabs.sendMessage(tabId, message)
}

export const onMessage = (
  handler: (
    message: Message,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) => boolean | void
) => {
  chrome.runtime.onMessage.addListener(handler)
}
