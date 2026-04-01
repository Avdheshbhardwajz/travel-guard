// Currency conversion using the free Frankfurter API (no API key needed)
// https://www.frankfurter.app/

export const getExchangeRates = async (req, res) => {
  try {
    const { base = 'INR' } = req.query;

    const response = await fetch(
      `https://api.frankfurter.app/latest?from=${base}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }

    const data = await response.json();

    res.json({
      base: data.base,
      date: data.date,
      rates: data.rates,
    });
  } catch (error) {
    console.error('Exchange rate error:', error);
    // Return fallback rates if API is down
    res.json({
      base: 'INR',
      date: new Date().toISOString().split('T')[0],
      rates: {
        USD: 0.012,
        EUR: 0.011,
        GBP: 0.0094,
        JPY: 1.78,
        AUD: 0.018,
        CAD: 0.016,
        SGD: 0.016,
        THB: 0.41,
        AED: 0.044,
      },
      fallback: true,
    });
  }
};

export const convertCurrency = async (req, res) => {
  try {
    const { from = 'USD', to = 'INR', amount = 1 } = req.query;

    const response = await fetch(
      `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`
    );

    if (!response.ok) {
      throw new Error('Failed to convert currency');
    }

    const data = await response.json();

    res.json({
      from: data.base,
      to,
      amount: parseFloat(amount),
      convertedAmount: data.rates[to],
      date: data.date,
    });
  } catch (error) {
    console.error('Currency conversion error:', error);
    res.status(500).json({ message: 'Failed to convert currency' });
  }
};
