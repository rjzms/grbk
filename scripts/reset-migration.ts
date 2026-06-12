import { Pool } from '@neondatabase/serverless';

async function resetMigration() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    // 删除失败的迁移记录
    await pool.query(`
      DELETE FROM "_prisma_migrations"
      WHERE migration_name = '20260612_add_admin_role'
      AND finished_at IS NULL;
    `);

    console.log('✓ 清理失败的迁移记录');

    // 检查 UserRole 枚举是否存在
    const enumCheck = await pool.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'UserRole'
      );
    `);

    if (enumCheck.rows[0].exists) {
      console.log('✓ UserRole 枚举已存在');
    }

    // 检查 role 列是否存在
    const columnCheck = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'User' AND column_name = 'role';
    `);

    if (columnCheck.rows.length > 0) {
      console.log('✓ role 列已存在');
    } else {
      console.log('× role 列不存在，需要运行迁移');
    }

  } catch (error) {
    console.error('错误:', error);
  } finally {
    await pool.end();
  }
}

resetMigration();
