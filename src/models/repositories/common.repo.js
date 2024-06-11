const { BadRequestErrorResponse } = require("../../core/error.response");
const {
  convertSelectFields,
  convertUnselectFields,
} = require("../../utils/api.util");

const getList = async ({
  model,
  filter,
  limit = 50,
  page = 1,
  populate = "",
  sort = "{'_id':-1}",
  select = "",
  unselect = "",
  isPaging,
  viewFormatter,
}) => {
  if (!model) throw new BadRequestErrorResponse("Invalid request");

  const _populate =
    typeof populate === "string"
      ? populate.split(",").filter(Boolean)
      : populate;
  const _page = Math.max(1, parseInt(page));
  const _limit = Math.max(1, parseInt(limit));
  const skip = (_page - 1) * _limit;
  const _select = select
    ? convertSelectFields(select.split(",").filter(Boolean))
    : {};
  const _unselect = unselect
    ? convertUnselectFields(unselect.split(",").filter(Boolean))
    : {};

  const docs = await model
    .find(filter)
    .populate(_populate)
    .sort(global.parseJSON(sort))
    .skip(skip)
    .limit(_limit)
    .select({ ..._select, ..._unselect })
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
