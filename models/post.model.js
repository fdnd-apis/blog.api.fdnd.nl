const db = require('./db')
const helper = require('./helper')

/**
 * Constructor for new posts that checks if the passed object adheres the
 * format we need and throws errors if it doesn't
 * @param {*} post an object containing the necessary fields to make a new post
 */
const post = function (post) {
  // TODO: Check for sanity...
  this.postId = post.postId
  this.author = post.author
  this.title = post.title
  this.content = post.content
  this.image = post.image
  this.published = post.published
}

/**
 * Get all posts from the database, will be paginated if the number of
 * posts in the database exceeds process.env.LIST_PER_PAGE
 * @param {*} page the page of authors you want to get
 * @returns
 */
post.get = async function (page = 1) {
  const rows = await db.query(`SELECT * FROM post LIMIT ?,?`, [
    helper.getOffset(page, process.env.LIST_PER_PAGE),
    Number(process.env.LIST_PER_PAGE),
  ])

  return {
    data: helper.emptyOrRows(rows),
    meta: { page },
  }
}

/**
 *
 * @param {*} postId
 * @returns
 */
post.getById = async function (postId) {
  const rows = await db.query(`SELECT * FROM post WHERE postId = ?`, [postId])
  return {
    data: helper.emptyOrRows(rows),
    meta: {},
  }
}

/**
 * Add a new post to the database
 * @param {*} post a new post object created with the post constructor
 * @returns an object containing the inserted post with the newly inserted postId
 */
post.post = async function (post) {
  const rows = await db.query(`INSERT INTO post SET ${prepareQuery(post)}`, prepareParams(post))
  post.postId = rows.insertId
  return {
    data: [post],
    meta: {
      insertId: rows.insertId,
    },
  }
}

/**
 *
 * @param {*} post
 * @returns
 */
post.patch = async function (post) {
  const rows = await db.query(
    `UPDATE post SET ${prepareQuery(post)} WHERE postId = ?`,
    prepareParams(post)
  )
  return {
    data: helper.emptyOrRows(rows),
    meta: {},
  }
}

/**
 *
 * @param {*} post
 * @returns
 */
post.put = async function (post) {
  const rows = await db.query(
    `UPDATE post SET ${prepareQuery(post)} WHERE postId = ?`,
    prepareParams(post)
  )
  return {
    data: helper.emptyOrRows(rows),
    meta: {},
  }
}

/**
 *
 * @param {*} postId
 * @returns
 */
post.delete = async function (postId) {
  const rows = await db.query(`DELETE FROM post WHERE postId = ?`, [postId])
  return {
    data: helper.emptyOrRows(rows),
    meta: {},
  }
}

module.exports = post

/**
 * Prepares part of an SQL query based on a passed partial post object
 * @param {*} post partial post object containing at least the postId
 * @returns a string to be used in the patch query, eg 'field = ?, field2 = ? ...'
 */
function prepareQuery(post) {
  return Object.keys(post)
    .filter((field) => field != 'postId')
    .map((field) => `${field} = ?`)
    .reduce((prev, curr) => `${prev}, ${curr}`)
}

/**
 * Prepares a passed partial post object for querying the database. Whatever
 * fields are passed, the postId needs to be at the end.
 * @param {*} post partial post object containing at least the postId
 * @returns [] an array to be used in the patch query
 */
function prepareParams(post) {
  const { postId, ...preparedExample } = post
  return [...Object.values(preparedExample), postId]
}
