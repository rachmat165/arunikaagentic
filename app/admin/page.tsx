'use client'

import { useState } from 'react'

export default function AdminSetupPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [result, setResult] = useState<any>(null)
  const [checking, setChecking] = useState(false)
  const [dbStatus, setDbStatus] = useState<any>(null)
  const [pgStarting, setPgStarting] = useState(false)
  const [pgResult, setPgResult] = useState<any>(null)
  const [migrating, setMigrating] = useState(false)
  const [migrateResult, setMigrateResult] = useState<any>(null)
  const [migrateStatus, setMigrateStatus] = useState<any>(null)
  const [realSeeding, setRealSeeding] = useState(false)
  const [realSeedResult, setRealSeedResult] = useState<any>(null)

  const checkDB = async () => {
    setChecking(true)
    try {
      const res = await fetch('/api/admin/seed')
      const data = await res.json()
      setDbStatus(data)
      // Sync migration status from seed response
      if (data.success === true) {
        setMigrateStatus({ success: true, migrated: data.migrated === true, tablesFound: data.tablesFound ?? 5 })
      }
    } catch (e) {
      setDbStatus({ success: false, error: 'Tidak dapat terhubung ke API' })
    } finally {
      setChecking(false)
    }
  }

  const tryStartPg = async () => {
    setPgStarting(true)
    setPgResult(null)
    try {
      const res = await fetch('/api/admin/pg-start', { method: 'POST' })
      const data = await res.json()
      setPgResult(data)
      if (data.success) {
        setTimeout(checkDB, 2000)
      }
    } catch (e) {
      setPgResult({ success: false, error: 'Tidak dapat terhubung ke API pg-start' })
    } finally {
      setPgStarting(false)
    }
  }

  const runMigration = async () => {
    setMigrating(true)
    setMigrateResult(null)
    try {
      const res = await fetch('/api/admin/migrate', { method: 'POST' })
      const data = await res.json()
      setMigrateResult(data)
      if (data.success) {
        setMigrateStatus({ success: true, migrated: true, tablesFound: data.tablesCreated?.length || 5 })
        setTimeout(checkDB, 500)
      }
    } catch (e) {
      setMigrateResult({ success: false, error: 'Gagal menghubungi server' })
    } finally {
      setMigrating(false)
    }
  }

  const runRealSeed = async () => {
    if (!confirm('⚠️ Ini akan MENGHAPUS SEMUA data yang ada dan menggantinya dengan data real dari Cowork Scheduled Tasks 11 Mei 2026. Lanjutkan?')) return
    setRealSeeding(true)
    setRealSeedResult(null)
    try {
      const res = await fetch('/api/admin/real-seed', { method: 'POST' })
      const data = await res.json()
      setRealSeedResult(data)
      if (data.success) {
        setDbStatus({ success: true, migrated: true, counts: data.counts })
        setMigrateStatus({ success: true, migrated: true, tablesFound: 5 })
      }
    } catch (e) {
      setRealSeedResult({ success: false, error: 'Gagal menghubungi server' })
    } finally {
      setRealSeeding(false)
    }
  }

  const runSeed = async () => {
    setStatus('loading')
    setResult(null)
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' })
      const data = await res.json()
      setResult(data)
      setStatus(data.success ? 'success' : 'error')
      if (data.success) setDbStatus({ success: true, counts: data.counts })
    } catch (e) {
      setResult({ error: 'Gagal menghubungi server' })
      setStatus('error')
    }
  }

  const isDbConnected = dbStatus?.success === true
  const isMigrated = dbStatus?.migrated === true || migrateStatus?.migrated === true

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">⚙️</span>
            <h1 className="text-2xl font-bold text-gray-900">Admin Setup</h1>
          </div>
          <p className="text-gray-500">PT. Arunika Teknologi Global — Inisialisasi Data Sistem</p>
        </div>

        {/* Step 1: Database Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-1">📊 Step 1 — Status Database PostgreSQL</h2>
          <p className="text-xs text-gray-500 mb-4">
            Database URL: <code className="bg-gray-100 px-1 rounded">postgres://postgres:postgres@localhost:5432/arunika_agentic</code>
          </p>

          <div className="flex gap-2 mb-4">
            <button
              onClick={checkDB}
              disabled={checking}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 disabled:opacity-50"
            >
              {checking ? '⏳ Memeriksa...' : '🔍 Cek Koneksi DB'}
            </button>

            <button
              onClick={tryStartPg}
              disabled={pgStarting || isDbConnected}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {pgStarting ? '⏳ Mencoba start...' : '▶️ Coba Start PostgreSQL'}
            </button>
          </div>

          {pgResult && (
            <div className={`rounded-lg p-3 mb-3 text-sm ${pgResult.success ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
              {pgResult.success ? (
                <p className="text-green-700 font-medium">{pgResult.message}</p>
              ) : (
                <div>
                  <p className="text-yellow-800 font-medium mb-2">⚠️ {pgResult.error}</p>
                  {pgResult.manualSteps && (
                    <div className="bg-white rounded p-3 border border-yellow-200 mt-2">
                      <p className="text-xs font-semibold text-gray-700 mb-1">Langkah manual:</p>
                      {pgResult.manualSteps.map((s: string, i: number) => (
                        <p key={i} className="text-xs text-gray-600 font-mono">{s}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {dbStatus && (
            <div className={`rounded-lg p-4 ${isDbConnected ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              {isDbConnected ? (
                <>
                  <p className="text-green-700 font-medium mb-3">✅ Database terhubung dan siap</p>
                  {dbStatus.counts && (
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(dbStatus.counts || {}).map(([key, val]) => (
                        <div key={key} className="bg-white rounded-lg p-3 border border-green-100">
                          <p className="text-xs text-gray-500 uppercase">{key}</p>
                          <p className="text-2xl font-bold text-indigo-600">{val as string}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div>
                  <p className="text-red-700 font-medium mb-2">❌ Database tidak tersambung</p>
                  <p className="text-xs text-red-600 font-mono">{dbStatus.error || 'ECONNREFUSED - PostgreSQL tidak berjalan'}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Step 1b: Install Guide (shown when DB not connected) */}
        {!isDbConnected && (
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 mb-6">
            <h2 className="font-semibold text-blue-900 mb-3">🛠️ Panduan Setup PostgreSQL</h2>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <p className="font-medium text-gray-800 text-sm mb-2">Via Command Prompt (Admin):</p>
              <pre className="bg-gray-900 text-green-400 text-xs p-3 rounded overflow-x-auto">
{`"C:\\Program Files\\PostgreSQL\\18\\bin\\pg_isready.exe" -h localhost -p 5432
set PGPASSWORD=postgres
"C:\\Program Files\\PostgreSQL\\18\\bin\\createdb.exe" -U postgres -h localhost arunika_agentic`}
              </pre>
            </div>
            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-800">
                💡 Setelah PostgreSQL berjalan, klik <strong>"Cek Koneksi DB"</strong> untuk memverifikasi.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Run Migrations */}
        <div className={`bg-white rounded-xl border p-6 mb-6 shadow-sm ${!isDbConnected ? 'opacity-60 pointer-events-none' : 'border-gray-200'}`}>
          <h2 className="font-semibold text-gray-800 mb-2">🗄️ Step 2 — Buat Schema Database</h2>
          <p className="text-sm text-gray-500 mb-4">
            Buat semua tabel: divisions, tasks, approvals, messages, reports, audit_log, dan lainnya.
          </p>

          {!isDbConnected && (
            <div className="bg-gray-100 rounded-lg p-3 mb-4 text-sm text-gray-500 text-center">
              ⏸️ Selesaikan Step 1 terlebih dahulu
            </div>
          )}

          {isDbConnected && migrateStatus && (
            <div className={`rounded-lg p-3 mb-4 text-sm ${migrateStatus.migrated ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
              {migrateStatus.migrated ? (
                <p className="text-green-700 font-medium">
                  ✅ Schema sudah ada ({migrateStatus.tablesFound || migrateStatus.existingTables?.length}/5 tabel ditemukan)
                </p>
              ) : (
                <div>
                  <p className="text-amber-700 font-medium mb-1">⚠️ Schema belum dibuat</p>
                  {migrateStatus.missingTables?.length > 0 && (
                    <p className="text-xs text-amber-600">Tabel tidak ditemukan: {migrateStatus.missingTables.join(', ')}</p>
                  )}
                </div>
              )}
            </div>
          )}

          <button
            onClick={runMigration}
            disabled={migrating || !isDbConnected || isMigrated}
            className={`w-full py-3 rounded-xl font-bold text-base transition-all ${
              migrating
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isMigrated
                ? 'bg-green-600 text-white opacity-70 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {migrating ? '⏳ Menjalankan migration...'
              : isMigrated ? '✅ Schema Sudah Ada'
              : '🗄️ Jalankan Migration (Buat Tabel)'}
          </button>

          {migrateResult && (
            <div className={`mt-4 rounded-lg p-4 ${migrateResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              {migrateResult.success ? (
                <>
                  <p className="font-bold text-green-700 mb-2">{migrateResult.message}</p>
                  {migrateResult.tablesCreated && (
                    <div className="flex flex-wrap gap-2">
                      {migrateResult.tablesCreated.map((t: string) => (
                        <span key={t} className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-mono">{t}</span>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div>
                  <p className="font-bold text-red-700 mb-2">❌ Migration Gagal:</p>
                  <p className="text-sm text-red-600 font-mono">{migrateResult.error}</p>
                  {migrateResult.logs && migrateResult.logs.length > 0 && (
                    <details className="mt-3">
                      <summary className="text-xs text-gray-500 cursor-pointer">Lihat log detail</summary>
                      <pre className="mt-2 text-xs text-gray-600 bg-gray-100 p-2 rounded overflow-x-auto">
                        {migrateResult.logs.join('\n')}
                      </pre>
                    </details>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Step 3: Seed Data */}
        <div className={`bg-white rounded-xl border p-6 shadow-sm ${(!isDbConnected || !isMigrated) ? 'opacity-60 pointer-events-none' : 'border-gray-200'}`}>
          <h2 className="font-semibold text-gray-800 mb-2">🌱 Step 3 — Seed Data Divisi</h2>
          <p className="text-sm text-gray-500 mb-4">
            Insert data awal: tasks, approvals, messages, dan reports untuk semua divisi
            (CEO Office, Sales &amp; Marketing, Operations &amp; Finance).
          </p>

          {(!isDbConnected || !isMigrated) && (
            <div className="bg-gray-100 rounded-lg p-3 mb-4 text-sm text-gray-500 text-center">
              ⏸️ Selesaikan Step {!isDbConnected ? '1' : '2'} terlebih dahulu
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-5 text-sm text-amber-800">
            ⚠️ Data yang sudah ada tidak akan di-duplikasi (ON CONFLICT DO NOTHING).
            Aman dijalankan berkali-kali.
          </div>

          <button
            onClick={runSeed}
            disabled={status === 'loading' || !isDbConnected || !isMigrated}
            className={`w-full py-3 rounded-xl font-bold text-base transition-all ${
              status === 'loading'
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : status === 'success'
                ? 'bg-green-600 text-white hover:bg-green-700'
                : status === 'error'
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {status === 'loading' ? '⏳ Menyiapkan data...'
              : status === 'success' ? '✅ Seed Berhasil! Jalankan Lagi?'
              : status === 'error' ? '❌ Gagal — Coba Lagi'
              : '🚀 Jalankan Seed Data'}
          </button>

          {result && (
            <div className={`mt-5 rounded-lg p-4 ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              {result.success ? (
                <>
                  <p className="font-bold text-green-700 mb-3">{result.message}</p>
                  <ul className="space-y-1">
                    {(result.results || []).map((r: string, i: number) => (
                      <li key={i} className="text-sm text-green-700">{r}</li>
                    ))}
                  </ul>
                  {result.counts && (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {Object.entries(result.counts).map(([key, val]) => (
                        <div key={key} className="bg-white rounded p-2 border border-green-100 text-center">
                          <p className="text-xs text-gray-500">{key}</p>
                          <p className="font-bold text-indigo-600 text-lg">{val as string}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
                    <p className="text-sm text-green-800 font-medium">🎉 Langkah selanjutnya:</p>
                    <ol className="list-decimal list-inside text-sm text-green-700 mt-2 space-y-1">
                      <li>Buka <a href="/" className="underline font-medium">Dashboard</a></li>
                      <li>Klik "CEO Office" → "Approval Center" di sidebar</li>
                      <li>CEO dapat melihat dan melakukan approve/reject langsung</li>
                    </ol>
                  </div>
                </>
              ) : (
                <div>
                  <p className="font-bold text-red-700 mb-2">❌ Error:</p>
                  <p className="text-sm text-red-600 font-mono">{result.error}</p>
                  {(result.results || []).length > 0 && (
                    <ul className="mt-3 space-y-1">
                      {result.results.map((r: string, i: number) => (
                        <li key={i} className="text-sm text-gray-600">{r}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Step 4: Real Data dari Cowork Scheduled Tasks */}
        <div className={`bg-white rounded-xl border p-6 mt-6 shadow-sm ${!isMigrated ? 'opacity-60 pointer-events-none' : 'border-orange-200'}`}>
          <h2 className="font-semibold text-gray-800 mb-1">🔄 Step 4 — Ganti dengan Data Real (Hari Ini)</h2>
          <p className="text-sm text-gray-500 mb-4">
            Hapus semua data mock/dummy dan isi ulang dengan data real dari Cowork Scheduled Tasks hari ini
            (Foundation Prospecting, GCP Blocker, Daily Reports — 11 Mei 2026).
          </p>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4 text-sm text-orange-800">
            ⚠️ <strong>Peringatan:</strong> Tindakan ini akan <strong>menghapus semua data yang ada</strong> (tasks, approvals, messages, reports)
            dan menggantinya dengan data real dari scheduled tasks hari ini. Tidak bisa di-undo.
          </div>

          <div className="bg-gray-50 rounded-lg p-3 mb-5 text-xs text-gray-600 space-y-1">
            <p className="font-semibold text-gray-700 mb-2">Data real yang akan diinsert:</p>
            <p>📋 <strong>16 Tasks</strong> — CEO (5), Sales & Marketing (7), Ops & Finance (4)</p>
            <p>✅ <strong>5 Approvals</strong> — Foundation prospect selection, outreach, GCP eskalasi, travel budget</p>
            <p>💬 <strong>7 Messages</strong> — Daily reports, eskalasi GCP, arahan CEO</p>
            <p>📊 <strong>6 Reports</strong> — Foundation prospecting, status project, finance token report</p>
            <p className="mt-2 text-indigo-600 font-medium">Sumber: daily-sales-marketing-prospecting + daily-ceo-review + daily-finance-token-report + daily-product-erp-review</p>
          </div>

          <button
            onClick={runRealSeed}
            disabled={realSeeding || !isMigrated}
            className={`w-full py-3 rounded-xl font-bold text-base transition-all ${
              realSeeding
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            {realSeeding ? '⏳ Menghapus mock data & insert data real...' : '🔄 Reset & Insert Data Real Hari Ini'}
          </button>

          {realSeedResult && (
            <div className={`mt-4 rounded-lg p-4 ${realSeedResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              {realSeedResult.success ? (
                <>
                  <p className="font-bold text-green-700 mb-3">{realSeedResult.message}</p>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {Object.entries(realSeedResult.counts || {}).map(([key, val]) => (
                      <div key={key} className="bg-white rounded p-2 border border-green-100 text-center">
                        <p className="text-xs text-gray-500">{key}</p>
                        <p className="font-bold text-orange-600 text-lg">{val as string}</p>
                      </div>
                    ))}
                  </div>
                  <ul className="space-y-1">
                    {(realSeedResult.results || []).map((r: string, i: number) => (
                      <li key={i} className="text-sm text-green-700">{r}</li>
                    ))}
                  </ul>
                  <div className="mt-3 p-3 bg-white rounded-lg border border-green-200">
                    <p className="text-sm text-green-800 font-medium">🎉 Data real sudah aktif!</p>
                    <p className="text-sm text-green-700 mt-1">
                      Buka <a href="/" className="underline font-medium">Dashboard</a> → CEO Office → Approval Center
                    </p>
                  </div>
                </>
              ) : (
                <div>
                  <p className="font-bold text-red-700 mb-2">❌ Gagal:</p>
                  <p className="text-sm text-red-600 font-mono">{realSeedResult.error}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          PT. Arunika Teknologi Global · Jl. Calung No. 7, Kota Bandung · corsec@arunika2045.com
        </p>
      </div>
    </div>
  )
}
