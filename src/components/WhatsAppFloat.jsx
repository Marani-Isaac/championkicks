import whatsappIcon from '../assets/whatsupicon.jpg'
import { WHATSAPP_URL, PHONE_DISPLAY } from '../lib/company'

export default function WhatsAppFloat() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      className="ck-whatsapp-float"
      aria-label={`Chat on WhatsApp ${PHONE_DISPLAY}`}
    >
      <img src={whatsappIcon} alt="" className="h-full w-full object-contain" />
    </a>
  )
}
