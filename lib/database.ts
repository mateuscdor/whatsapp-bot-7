export default class Database {
	private static instance: Database;
	public storage: Partial<Record<string, any>>;
	private constructor() {
		this.storage = {};
	}

	public static async connect(): Promise<Database> {
		try {
			if (!Database.instance) Database.instance = new Database();
			return Database.instance;
		} catch (err) {
			throw err;
		}
	}}