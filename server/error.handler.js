let errListener;
const handle = (err, req, res, next)=>{
	console.error(err);
	return res.status(err.status || 500).send({
		message : err.message ? err.message : err,
		type    : err.name,
		trace   : err.stack
	});
};
module.exports = {
	handle,
	prep : (req, res, next)=>{
		if(errListener) process.removeListener('unhandledRejection', errListener);
		errListener = (err, promise)=>handle(err, req, res, next);
		process.once('unhandledRejection', errListener);
		next();
	}
};