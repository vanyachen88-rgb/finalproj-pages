window.PORTFOLIO_DATA = {
  "stages": [
    {
      "number": "01",
      "title": "模擬資料生成",
      "code": "SOURCE / 8 CSV FILES",
      "description": "依客戶、活動、租賃與設備之間的業務關係建立可重現的模擬資料，供後續資料品質與分析流程使用。",
      "tags": [
        "固定亂數種子",
        "日期邏輯",
        "業務關聯"
      ]
    },
    {
      "number": "02",
      "title": "Python ETL",
      "code": "EXTRACT → TRANSFORM → LOAD",
      "description": "分表讀取 CSV、統一欄位格式與資料型別，再依主從關係依序寫入資料庫。以模組化流程維持可讀性與重跑能力。",
      "tags": [
        "Python",
        "Pandas",
        "模組化程式"
      ]
    },
    {
      "number": "03",
      "title": "資料驗證",
      "code": "VALIDATE / QUALITY GATES",
      "description": "在載入前檢查缺值、完全重複列與基本欄位規則，讓資料品質檢查成為 ETL 的固定步驟。",
      "tags": [
        "NULL 檢查",
        "重複值檢查",
        "型別檢查"
      ]
    },
    {
      "number": "04",
      "title": "Cloud SQL 資料模型",
      "code": "DATABASE / SQL SERVER 2022",
      "description": "以八張資料表組織客戶、行銷、設備、租賃、付款與維修資訊。暫存表以 replace 載入，再使用 SQL Server MERGE 將資料更新到正式資料表。",
      "tags": [
        "Google Cloud SQL",
        "SQL Server 2022",
        "Staging → MERGE"
      ]
    },
    {
      "number": "05",
      "title": "Streamlit Dashboard",
      "code": "PRESENT / INTERACTIVE ANALYTICS",
      "description": "將 KPI、趨勢與分類分析組合成四個互動分頁，讓使用者切換分析視角並探索模擬資料。",
      "tags": [
        "Streamlit",
        "Plotly",
        "四個分頁"
      ]
    }
  ],
  "tables": [
    {
      "name": "Dim_Date",
      "rows": "1,096",
      "fields": [
        "date_id (PK)",
        "full_date",
        "year",
        "month",
        "day_name"
      ],
      "relation": "日期維度，供時間序列與週期分析使用。"
    },
    {
      "name": "Customers",
      "rows": "4,000",
      "fields": [
        "customer_id (PK)",
        "gender",
        "age",
        "city",
        "acquisition_channel"
      ],
      "relation": "一位客戶可對應多筆 Leads 與 Rentals。"
    },
    {
      "name": "Marketing_Campaigns",
      "rows": "40",
      "fields": [
        "campaign_id (PK)",
        "channel",
        "start_date",
        "end_date",
        "budget"
      ],
      "relation": "一檔活動可對應多筆 Leads。"
    },
    {
      "name": "Leads",
      "rows": "12,000",
      "fields": [
        "lead_id (PK)",
        "customer_id (FK)",
        "campaign_id (FK)",
        "lead_date",
        "status"
      ],
      "relation": "連結 Customers 與 Marketing_Campaigns。"
    },
    {
      "name": "Machines",
      "rows": "400",
      "fields": [
        "machine_id (PK)",
        "model",
        "purchase_date",
        "purchase_cost",
        "status"
      ],
      "relation": "一台設備可產生租賃與維修紀錄。"
    },
    {
      "name": "Rentals",
      "rows": "3,500",
      "fields": [
        "rental_id (PK)",
        "customer_id (FK)",
        "machine_id (FK)",
        "start_date",
        "end_date",
        "monthly_fee",
        "status"
      ],
      "relation": "連結客戶與設備，並對應付款紀錄。"
    },
    {
      "name": "Payments",
      "rows": "16,157",
      "fields": [
        "payment_id (PK)",
        "rental_id (FK)",
        "payment_date",
        "amount",
        "payment_status"
      ],
      "relation": "租賃產生多期付款，可追蹤營收。"
    },
    {
      "name": "Maintenance",
      "rows": "2,500",
      "fields": [
        "maintenance_id (PK)",
        "machine_id (FK)",
        "maintenance_date",
        "maintenance_type",
        "cost"
      ],
      "relation": "設備的維修與成本紀錄。"
    }
  ],
  "domains": [
    {
      "name": "行銷分析",
      "label": "MARKETING",
      "title": "線索從哪裡來，如何轉換？",
      "description": "串接客戶、行銷活動與潛在客戶資料，將預算與線索放在同一個分析視角。",
      "questions": [
        "各管道帶來多少潛在客戶？",
        "不同活動的線索狀態如何分布？",
        "哪些客群與城市值得進一步觀察？"
      ],
      "metrics": [
        [
          "12,000",
          "潛在客戶筆數"
        ],
        [
          "40",
          "行銷活動檔數"
        ]
      ],
      "caption": "專題將轉換定義為：同一客戶在 Lead 建立日後至少產生一筆租賃。以上數字均來自模擬資料。"
    },
    {
      "name": "銷售分析",
      "label": "SALES",
      "title": "租賃與收入如何形成？",
      "description": "從客戶租賃與付款紀錄觀察業績規模，為期間趨勢及客戶價值分析建立基礎。",
      "questions": [
        "月營收的變化趨勢為何？",
        "租賃與付款狀態如何分布？",
        "不同客群的貢獻有何差異？"
      ],
      "metrics": [
        [
          "3,500",
          "租賃筆數"
        ],
        [
          "NT$ 43.65M",
          "模擬總營收"
        ]
      ],
      "caption": "總營收依既有專題分析結果顯示，四捨五入至小數點後兩位百萬。"
    },
    {
      "name": "營運分析",
      "label": "OPERATIONS",
      "title": "設備與維修成本如何管理？",
      "description": "連結設備、租賃與維修紀錄，建立資產使用與維護成本的分析方向。",
      "questions": [
        "哪些設備類別的租賃量較高？",
        "維修成本如何隨時間變動？",
        "使用與維修狀況是否需要調整配置？"
      ],
      "metrics": [
        [
          "400",
          "設備筆數"
        ],
        [
          "NT$ 6.10M",
          "模擬維修總成本"
        ]
      ],
      "caption": "維修總成本依既有專題分析結果顯示，四捨五入至小數點後兩位百萬。"
    }
  ]
};
