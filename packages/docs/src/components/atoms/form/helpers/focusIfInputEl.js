export default function focusIfInputEl(e) {
  if (!e || !e.srcElement) return
  if (e.srcElement.nodeName === 'INPUT') e.srcElement.focus()
  if (e.srcElement.nodeName === 'TEXTAREA') e.srcElement.focus()
}
