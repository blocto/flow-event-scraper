export const getLastDatFromNowTimestamp: (number: number) => Date = (number) => {
  let lastDay = new Date().setDate(new Date().getDate() - number)
  return new Date(lastDay)
}

export const getOneHourFromNowTimestamp: () => Date = () => {
  let lastHour = new Date().setHours(new Date().getHours() - 1)
  return new Date(lastHour)
}

export const getLastMinuteFromNowTimestamp: (number: number) => Date = (number) => {
  let lastMinute = new Date().setMinutes(new Date().getMinutes() - number)
  return new Date(lastMinute)
}