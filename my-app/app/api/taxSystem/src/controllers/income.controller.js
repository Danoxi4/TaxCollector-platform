const Income = require('../models/income.model');
const TaxPeriod = require('../models/taxPeriod.model');
const { getOrCreateTaxPeriodId } = require('../utils/taxPeriodIdCreator'); // ✅ correct
 

// Add new income
exports.addIncome = async (req, res) => {
  try {
    const { amount, source, paidDate } = req.body;

    const date = paidDate ? new Date(paidDate) : new Date();
    const taxPeriodId = await getOrCreateTaxPeriodId(date);
    console.log("taxPeriodId", taxPeriodId )

    const receiptUrl = req.file ? `/uploads/receipts/${req.file.filename}` : null;
    


    const income = await Income.create({
      amount,
      source,
      date,
      receiptUrl,
      taxPeriodId,
      userId: req.user._id //"4a832c84c0ada085284abf30"// Assuming authentication middleware sets this
    });

    res.status(201).json({ message: 'Income recorded successfully', income });
  } catch (error) {
    console.error('Add Income Error:', error);
    res.status(500).json({ error: 'Failed to record income' });
  }
};

// Get all income records for logged-in user
exports.getIncomes = async (req, res) => {
  try {
    const userId = req.user._id
    const incomes = await Income.find({ userId /*userId: "4a832c84c0ada085284abf30"*/  })
      .populate('taxPeriodId')
      .sort({ receivedDate: -1 });

    res.status(200).json({ incomes });
  } catch (error) {
    console.error('Get Incomes Error:', error);
    res.status(500).json({ error: 'Failed to fetch income records' });
  }
};
