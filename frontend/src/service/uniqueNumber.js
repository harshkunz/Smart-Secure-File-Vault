let previousNumber = null;

export const generateUniqueNumber = () => {
  let newNumber = Math.floor(Math.random() * 1000000);
  if (newNumber === previousNumber) {
    newNumber = (newNumber + 1) % 1000000;
  }

  previousNumber = newNumber;
  return newNumber;
};
