export const getCookie = (match, split = 1) => {
  return document.cookie
    .split(";")
    .find((row) => row.includes(`${match}=`))
    ?.split("=")[split]
}
