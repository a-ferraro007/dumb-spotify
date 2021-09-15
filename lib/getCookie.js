export const getCookie = (match) => {
  return document.cookie
    .split(';')
    .find((row) => row.includes(`${match}=`))
    .split('=')[1]
}
