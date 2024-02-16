const { calculateAgeDistribution } = require('../calculate-age-distribution');
const { getDataFromDB } = require('../postgres-db-service');

// Mock getDataFromDB
jest.mock('../postgres-db-service');

describe('calculateAgeDistribution', () => {
  it('should calculate age distribution correctly', async () => {
    const mockData = {
      success: true,
      data: [
        { age: 18, count: 10 },
        { age: 30, count: 20 },
        { age: 50, count: 15 },
        { age: 70, count: 5 },
      ],
    };

    jest.mocked(getDataFromDB).mockResolvedValue(mockData)

    const result = await calculateAgeDistribution();

    expect(result).toEqual({
      '< 20': '20.00 %',
      '20 to 40': '40.00 %',
      '40 to 60': '30.00 %',
      '> 60': '10.00 %',
    });
  });

  it('should handle database query error', async () => {
    const mockError = {
      success: false,
      error: {
        success: false,
        error: 'Database connection failed',
      }
    };
    jest.mocked(getDataFromDB).mockResolvedValue(mockError)

    const result = await calculateAgeDistribution();

    expect(result).toEqual(mockError);
  });
});
