import NombaAccountService from '../services/NombaAccountService.js';

export async function getBalance(req, res, next) {
  try {
    const result = await NombaAccountService.getSubAccountBalance();
    res.json({ success: true, data: result.data || result });
  } catch (err) {
    next(err);
  }
}
