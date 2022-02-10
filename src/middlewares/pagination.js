export default async (req, res, next) => {
  res.locals.pagination = {};
  if (req.query.offset) { res.locals.pagination.offset = Number(req.query.offset); }
  if (req.query.limit) { res.locals.pagination.limit = Number(req.query.limit); }
  return next();
};
