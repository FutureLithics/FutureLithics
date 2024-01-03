const result = (start, end) => {
  start = Date.parse(start);
  end = Date.parse(end);

  const date = new Date(Math.floor(Math.random() * (end - start + 1) + start));
  const month = date.getMonth() + 1;
  const dateArray = [date.getFullYear(), month, date.getDate()];

  return dateArray.join("-");
};

const spring = result("2021-01-01", "2021-03-31");
const summer = result("2021-04-01", "2021-06-31");
const fall = result("2021-07-01", "2021-09-31");
const winter = result("2021-10-01", "2021-12-31");

const lineChartData = [
  { x2: "Technology", y: 3, x: spring },
  { x2: "Technology", y: 2, x: summer },
  { x2: "Technology", y: 5, x: fall },
  { x2: "Technology", y: 4, x: winter },
  { x2: "Product", y: 3, x: spring },
  { x2: "Product", y: 5, x: summer },
  { x2: "Product", y: 2, x: fall },
  { x2: "Product", y: 1, x: winter },
  { x2: "Materials", y: 5, x: spring },
  { x2: "Materials", y: 2, x: summer },
  { x2: "Materials", y: 7, x: fall },
  { x2: "Materials", y: 4, x: winter },
  { x2: "Maintenance", y: 1, x: spring },
  { x2: "Maintenance", y: 3, x: summer },
  { x2: "Maintenance", y: 7, x: fall },
  { x2: "Maintenance", y: 5, x: winter },
  { x2: "Sales", y: 2, x: spring },
  { x2: "Sales", y: 8, x: summer },
  { x2: "Sales", y: 6, x: fall },
  { x2: "Sales", y: 3, x: winter },
];

export default [...lineChartData];
