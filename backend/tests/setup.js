// Silencia console.error durante los tests (los controllers lo usan en catch controlados)
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});