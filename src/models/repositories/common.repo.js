const { BadRequestErrorResponse } = require("../../core/error.response");

const getList = async ({
  model,
  filter,
  limit,
  page,
  populate,
  sort,
  select,
  isPaging,
  viewFormatter,
}) => {
  if (!model) throw new BadRequestErrorResponse("Invalid request");

  const _populate = populate
    ? typeof populate === "string"
      ? populate.split(",").filter(Boolean)
      : populate
    : [];
  const _page = Math.max(1, parseInt(page || 1));
  const _limit = Math.max(1, parseInt(limit || 50));
  const skip = (_page - 1) * _limit;

  const docs = await model
    .find(filter)
    .populate(_populate)
    .sort(global.parseJSON(sort || '{"_id":-1}'))
    .skip(skip)
    .limit(_limit)
    .select(select || "")
    .lean();

  if (!isPaging === "true") {
    return viewFormatter ? docs.map((record) => viewFormatter(record)) : docs;
  }

  const total = await model.countDocuments(filter);
  const lastPage = Math.ceil(total / _limit);

  return {
    total,
    page: _page > lastPage ? lastPage : _page,
    limit: _limit,
    lastPage,
    docs: viewFormatter ? docs.map((record) => viewFormatter(record)) : docs,
  };
};

module.exports = {
  getList,
};
