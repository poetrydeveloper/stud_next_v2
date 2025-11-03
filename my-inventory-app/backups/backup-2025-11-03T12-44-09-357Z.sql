--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: CashEventType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CashEventType" AS ENUM (
    'SALE',
    'RETURN',
    'PRICE_QUERY',
    'ORDER'
);


ALTER TYPE public."CashEventType" OWNER TO postgres;

--
-- Name: ProductUnitCardStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ProductUnitCardStatus" AS ENUM (
    'CANDIDATE',
    'SPROUTED',
    'IN_REQUEST',
    'IN_DELIVERY',
    'CLEAR',
    'ARRIVED'
);


ALTER TYPE public."ProductUnitCardStatus" OWNER TO postgres;

--
-- Name: ProductUnitPhysicalStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ProductUnitPhysicalStatus" AS ENUM (
    'IN_STORE',
    'SOLD',
    'CREDIT',
    'LOST',
    'IN_DISASSEMBLED',
    'IN_COLLECTED'
);


ALTER TYPE public."ProductUnitPhysicalStatus" OWNER TO postgres;

--
-- Name: UnitDisassemblyStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UnitDisassemblyStatus" AS ENUM (
    'MONOLITH',
    'DISASSEMBLED',
    'PARTIAL',
    'COLLECTED',
    'RESTORED'
);


ALTER TYPE public."UnitDisassemblyStatus" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    email text NOT NULL,
    name text
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: brands; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.brands (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.brands OWNER TO postgres;

--
-- Name: brands_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.brands_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.brands_id_seq OWNER TO postgres;

--
-- Name: brands_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.brands_id_seq OWNED BY public.brands.id;


--
-- Name: cash_days; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cash_days (
    id integer NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    is_closed boolean DEFAULT false NOT NULL,
    total double precision DEFAULT 0.00 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.cash_days OWNER TO postgres;

--
-- Name: cash_days_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cash_days_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cash_days_id_seq OWNER TO postgres;

--
-- Name: cash_days_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cash_days_id_seq OWNED BY public.cash_days.id;


--
-- Name: cash_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cash_events (
    id integer NOT NULL,
    type public."CashEventType" NOT NULL,
    amount double precision NOT NULL,
    notes text,
    cash_day_id integer NOT NULL,
    product_unit_id integer,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.cash_events OWNER TO postgres;

--
-- Name: cash_events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cash_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cash_events_id_seq OWNER TO postgres;

--
-- Name: cash_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cash_events_id_seq OWNED BY public.cash_events.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    path text NOT NULL,
    human_path text,
    node_index text,
    parent_id integer
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: customers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customers (
    id integer NOT NULL,
    name text NOT NULL,
    phone text,
    notes text
);


ALTER TABLE public.customers OWNER TO postgres;

--
-- Name: customers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.customers_id_seq OWNER TO postgres;

--
-- Name: customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.customers_id_seq OWNED BY public.customers.id;


--
-- Name: disassembly_scenarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.disassembly_scenarios (
    id integer NOT NULL,
    name text NOT NULL,
    "partsCount" integer NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "childProductCodes" jsonb NOT NULL,
    "parentProductCode" text NOT NULL
);


ALTER TABLE public.disassembly_scenarios OWNER TO postgres;

--
-- Name: disassembly_scenarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.disassembly_scenarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.disassembly_scenarios_id_seq OWNER TO postgres;

--
-- Name: disassembly_scenarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.disassembly_scenarios_id_seq OWNED BY public.disassembly_scenarios.id;


--
-- Name: inventory_forecasts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_forecasts (
    id integer NOT NULL,
    "productUnitId" integer NOT NULL,
    "forecastDate" timestamp(3) without time zone NOT NULL,
    "periodStart" timestamp(3) without time zone NOT NULL,
    "periodEnd" timestamp(3) without time zone NOT NULL,
    "periodType" text NOT NULL,
    "predictedSales" integer NOT NULL,
    "recommendedOrder" integer NOT NULL,
    confidence double precision NOT NULL,
    "actualSales" integer,
    accuracy double precision,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.inventory_forecasts OWNER TO postgres;

--
-- Name: inventory_forecasts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inventory_forecasts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inventory_forecasts_id_seq OWNER TO postgres;

--
-- Name: inventory_forecasts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inventory_forecasts_id_seq OWNED BY public.inventory_forecasts.id;


--
-- Name: inventory_snapshots; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_snapshots (
    id integer NOT NULL,
    "snapshotDate" timestamp(3) without time zone NOT NULL,
    "productUnitId" integer,
    "statusProduct" public."ProductUnitPhysicalStatus",
    "salePrice" double precision,
    "stockValue" double precision,
    "periodType" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.inventory_snapshots OWNER TO postgres;

--
-- Name: inventory_snapshots_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inventory_snapshots_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inventory_snapshots_id_seq OWNER TO postgres;

--
-- Name: inventory_snapshots_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inventory_snapshots_id_seq OWNED BY public.inventory_snapshots.id;


--
-- Name: product_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_images (
    id integer NOT NULL,
    "productId" integer NOT NULL,
    filename text NOT NULL,
    path text NOT NULL,
    "isMain" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "githubUrl" text,
    "localPath" text,
    "storageType" text DEFAULT 'local'::text NOT NULL
);


ALTER TABLE public.product_images OWNER TO postgres;

--
-- Name: product_images_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_images_id_seq OWNER TO postgres;

--
-- Name: product_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_images_id_seq OWNED BY public.product_images.id;


--
-- Name: product_sales_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_sales_history (
    id integer NOT NULL,
    "productUnitId" integer NOT NULL,
    "cashEventId" integer NOT NULL,
    "periodDate" timestamp(3) without time zone NOT NULL,
    "periodType" text NOT NULL,
    "salePrice" double precision NOT NULL,
    "soldAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.product_sales_history OWNER TO postgres;

--
-- Name: product_sales_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_sales_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_sales_history_id_seq OWNER TO postgres;

--
-- Name: product_sales_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_sales_history_id_seq OWNED BY public.product_sales_history.id;


--
-- Name: product_unit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_unit_logs (
    id integer NOT NULL,
    "productUnitId" integer NOT NULL,
    type text,
    message text NOT NULL,
    meta jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.product_unit_logs OWNER TO postgres;

--
-- Name: product_unit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_unit_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_unit_logs_id_seq OWNER TO postgres;

--
-- Name: product_unit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_unit_logs_id_seq OWNED BY public.product_unit_logs.id;


--
-- Name: product_units; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_units (
    id integer NOT NULL,
    serial_number text NOT NULL,
    "productId" integer NOT NULL,
    sale_price double precision,
    sold_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    credit_paid_at timestamp(3) without time zone,
    "isReturned" boolean DEFAULT false NOT NULL,
    is_credit boolean DEFAULT false NOT NULL,
    "parentProductUnitId" integer,
    product_category_id integer,
    product_category_name text,
    product_code text,
    product_description text,
    product_name text,
    product_tags jsonb,
    request_price_per_unit double precision,
    returned_at timestamp(3) without time zone,
    "statusCard" public."ProductUnitCardStatus" NOT NULL,
    "statusProduct" public."ProductUnitPhysicalStatus",
    created_at_candidate timestamp(3) without time zone,
    created_at_request timestamp(3) without time zone,
    "customerId" integer,
    quantity_in_candidate integer DEFAULT 0,
    quantity_in_request integer DEFAULT 0,
    "supplierId" integer,
    "spineId" integer,
    "disassembledParentId" integer,
    "disassemblyStatus" public."UnitDisassemblyStatus" DEFAULT 'MONOLITH'::public."UnitDisassemblyStatus" NOT NULL,
    "isParsingAlgorithm" boolean DEFAULT false NOT NULL,
    "disassemblyScenarioId" integer
);


ALTER TABLE public.product_units OWNER TO postgres;

--
-- Name: product_units_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_units_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_units_id_seq OWNER TO postgres;

--
-- Name: product_units_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_units_id_seq OWNED BY public.product_units.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    description text,
    "categoryId" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "brandId" integer NOT NULL,
    "spineId" integer,
    human_path text,
    node_index text
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: reorder_points; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reorder_points (
    id integer NOT NULL,
    "productUnitId" integer NOT NULL,
    "minStock" integer NOT NULL,
    "maxStock" integer NOT NULL,
    "reorderQty" integer NOT NULL,
    "leadTime" integer NOT NULL,
    "safetyStock" integer NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.reorder_points OWNER TO postgres;

--
-- Name: reorder_points_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reorder_points_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reorder_points_id_seq OWNER TO postgres;

--
-- Name: reorder_points_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reorder_points_id_seq OWNED BY public.reorder_points.id;


--
-- Name: spines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.spines (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    "categoryId" integer,
    "imagePath" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "brandData" json,
    human_path text,
    node_index text
);


ALTER TABLE public.spines OWNER TO postgres;

--
-- Name: spines_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.spines_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.spines_id_seq OWNER TO postgres;

--
-- Name: spines_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.spines_id_seq OWNED BY public.spines.id;


--
-- Name: stock_traffic_lights; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_traffic_lights (
    id integer NOT NULL,
    "productCode" text NOT NULL,
    "brandName" text NOT NULL,
    "minStock" integer DEFAULT 1 NOT NULL,
    "normalStock" integer DEFAULT 2 NOT NULL,
    "goodStock" integer DEFAULT 3 NOT NULL,
    "weeklySales" integer DEFAULT 0 NOT NULL,
    "categoryId" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.stock_traffic_lights OWNER TO postgres;

--
-- Name: stock_traffic_lights_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stock_traffic_lights_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stock_traffic_lights_id_seq OWNER TO postgres;

--
-- Name: stock_traffic_lights_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stock_traffic_lights_id_seq OWNED BY public.stock_traffic_lights.id;


--
-- Name: suppliers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.suppliers (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.suppliers OWNER TO postgres;

--
-- Name: suppliers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.suppliers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.suppliers_id_seq OWNER TO postgres;

--
-- Name: suppliers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.suppliers_id_seq OWNED BY public.suppliers.id;


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Name: brands id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brands ALTER COLUMN id SET DEFAULT nextval('public.brands_id_seq'::regclass);


--
-- Name: cash_days id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cash_days ALTER COLUMN id SET DEFAULT nextval('public.cash_days_id_seq'::regclass);


--
-- Name: cash_events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cash_events ALTER COLUMN id SET DEFAULT nextval('public.cash_events_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: customers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers ALTER COLUMN id SET DEFAULT nextval('public.customers_id_seq'::regclass);


--
-- Name: disassembly_scenarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.disassembly_scenarios ALTER COLUMN id SET DEFAULT nextval('public.disassembly_scenarios_id_seq'::regclass);


--
-- Name: inventory_forecasts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_forecasts ALTER COLUMN id SET DEFAULT nextval('public.inventory_forecasts_id_seq'::regclass);


--
-- Name: inventory_snapshots id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_snapshots ALTER COLUMN id SET DEFAULT nextval('public.inventory_snapshots_id_seq'::regclass);


--
-- Name: product_images id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images ALTER COLUMN id SET DEFAULT nextval('public.product_images_id_seq'::regclass);


--
-- Name: product_sales_history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_sales_history ALTER COLUMN id SET DEFAULT nextval('public.product_sales_history_id_seq'::regclass);


--
-- Name: product_unit_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_unit_logs ALTER COLUMN id SET DEFAULT nextval('public.product_unit_logs_id_seq'::regclass);


--
-- Name: product_units id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_units ALTER COLUMN id SET DEFAULT nextval('public.product_units_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: reorder_points id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reorder_points ALTER COLUMN id SET DEFAULT nextval('public.reorder_points_id_seq'::regclass);


--
-- Name: spines id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.spines ALTER COLUMN id SET DEFAULT nextval('public.spines_id_seq'::regclass);


--
-- Name: stock_traffic_lights id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_traffic_lights ALTER COLUMN id SET DEFAULT nextval('public.stock_traffic_lights_id_seq'::regclass);


--
-- Name: suppliers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers ALTER COLUMN id SET DEFAULT nextval('public.suppliers_id_seq'::regclass);


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, email, name) FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
16659583-4d83-4e4d-aee5-2eba93741af5	6097743f8f826ee9c930d428445ca4871ba277989671ce520d018d9440ac1cbf	2025-10-24 15:21:29.960017+03	20250821120718_init	\N	\N	2025-10-24 15:21:29.952021+03	1
b25d5809-6a58-4f04-96fa-e13a882b8155	44334d5f147b873799966a3a4c3a60ae16f4642dbe3051542ad5ba0c496f69b4	2025-10-24 15:21:30.084877+03	20251005102252_add_brand_data_to_spine	\N	\N	2025-10-24 15:21:30.079468+03	1
663a9df4-ce64-4955-b3e7-d525f432f4ba	a3c0b3d748399cbd945ab90c4b7d0b62dd3277636b6f41e87cf2ec16439e5f22	2025-10-24 15:21:29.980963+03	20250822101836_add_products	\N	\N	2025-10-24 15:21:29.960266+03	1
b605edf4-9186-4f90-840a-0dffc1dac419	2a036f61a9dffbb5eac2939f47e527dfa47bee8f57a95597890d2a50a7177975	2025-10-24 15:21:29.993403+03	20250828083337_add_requests	\N	\N	2025-10-24 15:21:29.981222+03	1
f94dd7dc-51be-484d-bfd4-3577eb9c1c7a	7f43e3217dfed2f0a559c35e1da19e16d7b816d98a02e70d482b7e9dd92103d0	2025-10-24 15:21:29.99506+03	20250828090249_add_requestitem_status_nullable_request	\N	\N	2025-10-24 15:21:29.993643+03	1
aae29d53-6cb0-49b1-9ae2-45a0778f6565	24bdb8206665439383f9f6aa150099ac964a315705acb3445597c0a79c0da539	2025-10-24 15:21:30.085898+03	20251008080927_add_storage_fields_to_product_image	\N	\N	2025-10-24 15:21:30.085094+03	1
bd51299d-1e30-4630-9a8d-01ab8e84ead8	745a1cf4d376e55517ac77da7b1f71104dea18edeca26c34c5b18c693abbf29c	2025-10-24 15:21:30.006451+03	20250830104144_add_supplier_customer_relations	\N	\N	2025-10-24 15:21:29.995296+03	1
83c66018-c697-4b41-b846-b6d453c50d0d	a3daecbe80eafe9cd640334c371673cf2656a1ff2f0da969ec9254b28430cd9f	2025-10-24 15:21:30.013681+03	20250909092344_delivery	\N	\N	2025-10-24 15:21:30.00669+03	1
bd31a765-d80f-4b65-8ebb-be09a2f58997	f1667b9846849fff9b81db03f415362255ecc60e266d9d17eecf668fb0b97a1c	2025-10-24 15:21:30.022468+03	20250911110306_add_product_units_relations	\N	\N	2025-10-24 15:21:30.013943+03	1
5491edbe-06d7-4177-a77b-a55694b66323	976bcf0b774d3b5b5c6f2b936ab5276ce377c22fbb619248d946085ed8bc85ac	2025-10-24 15:21:30.095573+03	20251009111713_add_disassembly_feature	\N	\N	2025-10-24 15:21:30.086127+03	1
2e304501-6f91-4478-88c3-2e5f2be7fe6a	5984d33527fb4d6d25fa428fc923aef47de57848a7680ebad02c34443617af1a	2025-10-24 15:21:30.044038+03	20250914115946_add_cash_system	\N	\N	2025-10-24 15:21:30.022703+03	1
dcd8a90b-b11c-4b7e-9cb7-506dd6329b90	ab92b7b4fc02e31c966eb076324f1af13faccf362c5b1d7ae74d3b2763cdd6b9	2025-10-24 15:21:30.047061+03	20250923114109_add_cash_event_relation	\N	\N	2025-10-24 15:21:30.044327+03	1
f3da385e-76d1-4668-9305-18aed2e59b2d	8ee17ad1ab36533275c785a2a5b8c455e31d69dfd54d0e28d937384a230b7df1	2025-10-24 15:21:30.062981+03	20250925093430_init	\N	\N	2025-10-24 15:21:30.047323+03	1
49eaa4fc-8210-45af-ace4-d57c0e0f1b4f	bb96e01bddaff8038b65f4ac87980ef3fc16032a94f6fa276e5abed4ac9c329d	2025-10-24 15:21:30.100499+03	20251010105616_fix_disassembly_relations	\N	\N	2025-10-24 15:21:30.09581+03	1
78b54b06-9bc5-4671-a30e-64e191a8fbb7	91366dd8358f057d1b5d8ebf866055be3b6f6b9cfff556e365bed43cf77a6d1e	2025-10-24 15:21:30.064078+03	20250925110251_add_productunit_fields	\N	\N	2025-10-24 15:21:30.063242+03	1
8341407f-7d16-44cc-91a1-f0ad112d9cff	b9586b45cf17922689d38e947d36e009e886f2a8f078053e2f25cf95ed31b724	2025-10-24 15:21:30.072771+03	20250926073852_add_spine_entity	\N	\N	2025-10-24 15:21:30.064331+03	1
adf6b885-ed4d-4f14-aeb0-a4d443f8547a	7e52e1dd5f7801459ab5ccefdb186139920e153dd53377ce73e41264c5ec8544	2025-10-24 15:21:30.07924+03	20250930104749_add_product_unit_logs	\N	\N	2025-10-24 15:21:30.073028+03	1
4c3d48ae-b64a-40b8-8def-2621b8b547cf	562f3e806d883ba0e84f376f5a84393b419f723c351114ab2cf57af97c6e6d4b	2025-10-24 15:21:30.130878+03	20251015073418_add_inventory_analytics_models	\N	\N	2025-10-24 15:21:30.100777+03	1
94ad61fc-4971-48c4-857a-8c7c96a500b0	b5f6962c4fba7d562b7f0bfa125bd6a879f4f1813c3ba3a1dbdcd20abbfe51a3	2025-10-24 15:21:30.147207+03	20251021093444_init_node_index_system	\N	\N	2025-10-24 15:21:30.131172+03	1
2e70d6c0-13d3-4d2e-a765-7850b3db07dc	7e1d31d63fb1be967e974c57ee76e4bcb5a698257e6a967bb0006cfebbe072d3	2025-10-25 10:02:55.102461+03	20251025070255_1	\N	\N	2025-10-25 10:02:55.096797+03	1
4fa24043-5811-4e56-878e-0aff3c2a0226	c0f7863d183d9d1cf42d42e8ba9e1a2caa5a7101bd82b55e7fb9ec9fea44a61b	2025-10-28 10:28:19.162794+03	20251028072819_add_stock_traffic_lights	\N	\N	2025-10-28 10:28:19.140331+03	1
\.


--
-- Data for Name: brands; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.brands (id, name, slug, "createdAt", "updatedAt") FROM stdin;
1	Eco	eco	2025-10-24 12:29:41.622	2025-10-24 12:29:41.622
2	Дело техники	delo-tehniki	2025-10-24 12:38:51.552	2025-10-24 12:38:51.552
3	Force	force	2025-10-25 06:45:14.201	2025-10-25 06:45:14.201
4	TOPTUL	toptul	2025-10-25 06:58:24.001	2025-10-25 06:58:24.001
5	ARNEZI	arnezi	2025-10-25 07:32:30.942	2025-10-25 07:32:30.942
6	STARTUL	startul	2025-10-25 07:42:27.906	2025-10-25 07:42:27.906
7	Yato	yato	2025-10-25 08:09:59.947	2025-10-25 08:09:59.947
8	RockForce	rockforce	2025-10-25 08:41:31.393	2025-10-25 08:41:31.393
9	JCB	jcb	2025-10-25 08:59:11.487	2025-10-25 08:59:11.487
10	FORCEKRAFT	forcekraft	2025-10-25 09:26:10.829	2025-10-25 09:26:10.829
11	Автодело	avtodelo	2025-10-25 12:16:36.098	2025-10-25 12:16:36.098
12	Forsage	forsage	2025-10-27 10:48:01.007	2025-10-27 10:48:01.007
13	Эврика	evrika	2025-10-28 09:33:06.336	2025-10-28 09:33:06.336
14	Хорекс Авто	horeks-avto	2025-10-29 07:44:59.232	2025-10-29 07:44:59.232
15	Baum	baum	2025-10-29 08:23:54.072	2025-10-29 08:23:54.072
16	Scheppach	scheppach	2025-10-29 08:34:41.244	2025-10-29 08:34:41.244
17	Stab	stab	2025-10-29 08:57:52.817	2025-10-29 08:57:52.817
18	Partner	partner	2025-11-03 09:25:30.474	2025-11-03 09:25:30.474
\.


--
-- Data for Name: cash_days; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cash_days (id, date, is_closed, total, created_at, updated_at) FROM stdin;
1	2025-10-23 21:00:00	t	41	2025-10-24 12:31:39.269	2025-10-24 12:46:23.492
5	2025-10-28 21:00:00	t	411	2025-10-29 06:14:39.233	2025-10-29 12:24:37.178
2	2025-10-24 21:00:00	t	372	2025-10-25 06:31:20.19	2025-10-25 13:03:33.862
6	2025-10-29 21:00:00	t	108	2025-10-30 07:45:32.328	2025-10-30 12:50:12.003
3	2025-10-26 21:00:00	t	244	2025-10-27 09:01:14.19	2025-10-27 20:59:59.999
7	2025-10-30 21:00:00	t	27	2025-10-31 07:12:31.23	2025-10-31 20:59:59.999
4	2025-10-27 21:00:00	t	125	2025-10-28 09:16:46.267	2025-10-28 12:54:55.648
8	2025-11-01 21:00:00	t	229	2025-11-02 10:26:33.247	2025-11-02 12:11:43.722
10	2025-11-02 21:00:00	t	180	2025-11-03 08:56:47.456	2025-11-03 12:43:41.304
\.


--
-- Data for Name: cash_events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cash_events (id, type, amount, notes, cash_day_id, product_unit_id, created_at) FROM stdin;
1	SALE	35	Продажа: Пистолет для антикоррозионных покрытий SG-35C14 ECO со шлангом	1	1	2025-10-24 12:31:56.11
2	SALE	6	Продажа: Головка двенадцатигранная 21 мм 1/2"	1	3	2025-10-24 12:41:07.512
3	SALE	6	Продажа: Бита Torx T40 10 мм. FORCE 1767540	2	15	2025-10-25 06:50:20.097
4	SALE	5	Продажа: Переходник 3/8"(F)х1/4(М) TOPTUL	2	20	2025-10-25 06:56:07.027
5	SALE	50	Продажа: Заклепочник поворотный усиленный 2,4-4,8мм STARTUL PROFI (ST4581)	2	35	2025-10-25 07:44:07.917
6	SALE	3	Продажа: Головка 8мм (6гр.), 1/4''	2	89	2025-10-25 08:54:12.57
7	SALE	4	Продажа: Головка-бита Philips PH.2 1/4'' FORCE 321322	2	77	2025-10-25 08:54:32.954
8	SALE	10	Продажа: Головка ударная глубокая 10мм (6гр.), 1/2''	2	90	2025-10-25 09:00:31.417
9	SALE	10	Продажа: Съёмник пистонов обшивки изогнутый 6мм	2	96	2025-10-25 09:22:43.219
10	SALE	5	Продажа: Бита TORX T55х75ммL	2	107	2025-10-25 09:47:33.11
11	SALE	120	Продажа: Набор головок ударных глубоких 16пр.,1/2''6гр.(10,12-19,21,22,24,27,30,32,36мм), в металлическом кейсе	2	108	2025-10-25 09:52:48.141
12	SALE	3	Продажа: Головка 10мм (6гр.), 1/4''	2	111	2025-10-25 10:34:47.011
13	SALE	3	Продажа: Головка 8мм (6гр.), 1/4''	2	88	2025-10-25 10:34:58.19
14	SALE	45	Продажа: Съёмник масляных фильтров ременной Ø60-140 мм	2	113	2025-10-25 10:38:43.752
15	SALE	30	Продажа: Болт к набору для замены сайлентблоков М12	2	116	2025-10-25 12:08:26.96
16	SALE	30	Продажа: Шарнир ударный 1/2"х62мм TOPTUL	2	121	2025-10-25 12:13:32.63
17	SALE	17	Продажа: Головка разрезная для монтажа кислородного датчика 22 мм ½	2	127	2025-10-25 12:18:38.777
18	SALE	5	Продажа: Головка двенадцатигранная 19мм 1/2"	2	132	2025-10-25 12:31:22.527
19	SALE	6	Продажа: Головка двенадцатигранная 21 мм 1/2"	2	4	2025-10-25 12:46:37.252
20	SALE	20	Продажа: Трещотка реверсивная усиленная изогнутая с резиновой ручкой 1/4''(72зуб.)	2	135	2025-10-25 12:51:18.008
21	SALE	55	Продажа: Набор ключей комбинированных, 16пр.(6-19, 22, 24мм), в пластиковом держателе	3	140	2025-10-27 10:49:44.275
22	SALE	140	Продажа: Набор инструментов 108пр.1/4''&1/2''(6-гран)(4-32мм)	3	143	2025-10-27 11:13:09.962
23	SALE	10	Продажа: Адаптер-переходник 3/8''(F)x1/2''(M)	3	147	2025-10-27 11:18:32.069
24	SALE	12	Продажа: Головка ударная 36мм (12гр.), 1/2''	3	167	2025-10-27 11:24:32.313
25	SALE	9	Продажа: Головка ударная шестигранная 19 мм 1/2"	3	171	2025-10-27 11:28:40.532
26	SALE	18	Продажа: Пистолет продувочный c комплектом сопел ECO ABG-20	3	174	2025-10-27 11:32:50.624
27	SALE	15	Продажа: Головка свечная 3/8" 14мм L63мм CrV "Yato"	4	185	2025-10-28 09:25:45.894
28	SALE	10	Продажа: Вороток 3/8" DR Г-образный 250мм на держателе ЭВРИКА	4	186	2025-10-28 09:35:47.8
29	SALE	28	Продажа: Болт к набору для замены сайлентблоков М12	4	220	2025-10-28 10:01:16.027
30	SALE	5	Продажа: Насадка TORX T50 75мм LONG TOPTUL	4	229	2025-10-28 10:56:45.077
31	SALE	10	Продажа: Набор бит TORX с отверст. Т10-Т40 7шт. TOPTUL	4	254	2025-10-28 10:58:26.46
32	SALE	4	Продажа: Насадка TORX T45 30мм TOPTUL (Присоединительный размер 10мм)	4	265	2025-10-28 12:07:14.549
33	SALE	6	Продажа: Насадка TORX T45 75мм LONG TOPTUL	4	241	2025-10-28 12:08:05.305
34	SALE	19	Продажа: Ключ комбинированный 32мм	4	266	2025-10-28 12:29:20.847
35	SALE	20	Продажа: Монтировка с рукояткой 20×450мм	4	276	2025-10-28 12:37:37.151
36	SALE	8	Продажа: Ключ четырехгранный 8мм	4	288	2025-10-28 12:48:02.353
37	SALE	6	Продажа: Бита Torx T40 10 мм. FORCE 1767540	5	14	2025-10-29 06:15:21.231
38	SALE	4	Продажа: ита- сплайн М7 30мм Force 1783007	5	289	2025-10-29 06:19:11.288
39	SALE	80	Продажа: Ключ динамометрический 1/4' 5-25 Нм, 72 зуба, в кейсе L=245мм ARNEZI R7300141	5	293	2025-10-29 07:30:33.64
40	SALE	40	Продажа: Трещотка 1/4" 36зуб. 131мм TOPTUL	5	302	2025-10-29 08:22:13.248
41	SALE	15	Продажа: Метчик M14x1,5 (3шт)	5	319	2025-10-29 08:35:51.305
42	SALE	25	Продажа: Клещи переставные ER-13130 универсальные, покрытие черное порошковое 300мм ЭВРИКА 1/36	5	324	2025-10-29 08:40:47.742
43	SALE	5	Продажа: Щётка-мини с прорезиненной рукояткой, щетина из нержавеющей стали	5	330	2025-10-29 08:45:08.656
44	SALE	5	Продажа: Бита Force 1767545 T45	5	331	2025-10-29 08:48:58.496
45	SALE	5	Продажа: Насадка 10мм. L-75мм. TORX T30 FORCE 1767530	5	252	2025-10-29 08:49:32.229
46	SALE	5	Продажа: Насадка 10мм. L-75мм. TORX T30 FORCE 1767530	5	251	2025-10-29 08:51:41.401
47	SALE	12	Продажа: Вороток Г-образн. (3/8"; 200*75 mm) АвтоDело	5	337	2025-10-29 08:56:33.441
48	SALE	5	Продажа: Щетка для чистки каналов	5	360	2025-10-29 09:00:40.005
49	SALE	30	Продажа: Съемник рулевых тяг универсальный 27-42мм, 1/2''	5	361	2025-10-29 09:04:14.258
50	RETURN	-30	Возврат: Съемник рулевых тяг универсальный 27-42мм, 1/2'' (Возврат товара)	5	361	2025-10-29 09:41:53.586
51	SALE	18	Продажа: Головка ударная глубокая 27мм (6гр.), 3/4''	5	382	2025-10-29 09:57:26.202
52	SALE	30	Продажа: ARNEZI R7401001 Поддон для слива масла 8 л.	5	34	2025-10-29 09:57:58.431
53	SALE	30	Продажа: Шарнир ударный 1/2"х62мм TOPTUL	5	120	2025-10-29 10:11:53.95
54	SALE	24	Продажа: Съемник клемм АКБ и поводков стеклоочистителя Хорекс Авто	5	385	2025-10-29 10:48:31.506
55	SALE	40	Продажа: Трещотка 45 зубцов 1/2"	5	387	2025-10-29 10:51:22.994
56	SALE	50	Продажа: Набор ключей комбинированных, 16пр.(6-19, 22, 24мм), в пластиковом держателе	5	139	2025-10-29 10:52:53.04
57	SALE	12	Продажа: Головка ударная 36мм (12гр.), 1/2''	5	166	2025-10-29 11:07:13.035
58	SALE	3.5	Продажа: Ключ комбинированный 10мм	6	403	2025-10-30 07:56:56.645
59	SALE	3.5	Продажа: Ключ комбинированный 10мм	6	402	2025-10-30 07:57:05.164
60	SALE	3	Продажа: Ключ комбинированный 10мм	6	408	2025-10-30 08:07:48.403
61	RETURN	-3	Возврат: Ключ комбинированный 10мм (Возврат товара)	6	408	2025-10-30 08:25:45.677
62	SALE	3	Продажа: Ключ комбинированный 8мм	6	408	2025-10-30 08:31:38.507
63	SALE	5	Продажа: Рукоятка для головок 1/4''(6''-150мм)	6	420	2025-10-30 08:32:06.007
64	SALE	2	Продажа: Головка шестигранная 7 мм 1/4"	6	424	2025-10-30 08:36:11.94
65	SALE	19	Продажа: Зубило для пневмомолотка по листовому металлу 178мм TOPTUL	6	433	2025-10-30 09:43:43.037
66	SALE	12	Продажа: Адаптер для головок 1/2''(F)х1/4''(M) L36 мм Force	6	439	2025-10-30 09:54:04.353
67	SALE	4	Продажа: Головка TORX E8 1/4"	6	446	2025-10-30 10:04:28.972
68	SALE	4	Продажа: Головка TORX E8 1/4"	6	445	2025-10-30 10:04:36.789
69	SALE	20	Продажа: Гайколом 12-16мм	6	448	2025-10-30 10:11:02.548
70	SALE	32	Продажа: Гайколом 16-22мм	6	447	2025-10-30 10:11:19.592
71	SALE	15	Продажа: Трещотка реверсивная усиленная изогнутая с резиновой ручкой 1/4''(72зуб.)	7	309	2025-10-31 07:12:56.134
72	SALE	12	Продажа: Трещотка реверсивная усиленная изогнутая с резиновой ручкой 1/4''(72зуб.)	7	308	2025-10-31 07:13:09.975
73	SALE	10	Продажа: Ключ Г-образный 6-гранный 13мм	8	458	2025-11-02 10:42:37.552
74	SALE	35	Продажа: Пистолет для антикоррозионных покрытий SG-35C14 ECO со шлангом	8	7	2025-11-02 10:53:35.811
75	SALE	7	Продажа: Зубило с шестигранным основанием 16мм (L-175мм),на пластиковом держателе	8	472	2025-11-02 10:57:02.589
76	SALE	30	Продажа: Вороток Г-образный двухсторонний ударный CR-Mo 450мм 3/4''	8	482	2025-11-02 11:17:44.521
77	SALE	12	Продажа: Головка ударная шестигранная 19 мм 1/2"	8	170	2025-11-02 11:19:57.663
78	SALE	95	Продажа: Подставка ремонтная 3т (h min 285мм, h max 420мм) (к-т 2шт.)	8	486	2025-11-02 11:24:22.463
79	SALE	5	Продажа: Переходник 1/2"(F)х3/8(М) TOPTUL	8	494	2025-11-02 11:33:59.362
80	SALE	13	Продажа: Головка 1/2" с насадкой TORX T60 TOPTUL	8	495	2025-11-02 11:37:55.553
81	SALE	22	Продажа: Клещи для самозажимных хомутов MUBEA ARNEZI	8	500	2025-11-02 11:55:14.946
82	SALE	40	Продажа: Шприц автомобильный для смазки 400мл PRO STARTUL (PRO-6065) (рычажно-плунжерный, с гибким шлангом и стальной трубкой)	10	504	2025-11-03 09:00:58.045
83	SALE	40	Продажа: Отвёртка ударная со вставками 5/16"	10	506	2025-11-03 09:08:10.707
84	SALE	38	Продажа: Вороток шарнирный 750мм 1/2''	10	509	2025-11-03 09:14:18.909
85	SALE	5	Продажа: Головка ударная 19мм (6гр.), 1/2''	10	511	2025-11-03 09:18:15.097
86	SALE	22	Продажа: Головка 46мм (12гр.), 3/4''	10	513	2025-11-03 09:21:40.527
87	SALE	13	Продажа: Съемник стопорных колец прямой на сжатие (L-175мм), в блистере	10	519	2025-11-03 09:27:16.564
88	SALE	22	Продажа: Клещи для самозажимных хомутов MUBEA ARNEZI	10	499	2025-11-03 10:03:55.261
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, slug, path, human_path, node_index, parent_id) FROM stdin;
1	Пневматика	pnevmatika	structure/d_pnevmatika	structure / pnevmatika	structure/d_pnevmatika	\N
2	Инструмент	instrument	structure/d_pnevmatika/d_instrument	structure / pnevmatika / instrument	structure/d_pnevmatika/d_instrument	1
3	Пистолет для гравитекса	pistolet-dlya-graviteksa	structure/d_pnevmatika/d_instrument/d_pistolet-dlya-graviteksa	structure / pnevmatika / instrument / pistolet-dlya-graviteksa	structure/d_pnevmatika/d_instrument/d_pistolet-dlya-graviteksa	2
4	Ручной инструмент	ruchnoy-instrument	structure/d_ruchnoy-instrument	structure / ruchnoy-instrument	structure/d_ruchnoy-instrument	\N
5	Головки торцевые	golovki-tortsevye	structure/d_ruchnoy-instrument/d_golovki-tortsevye	structure / ruchnoy-instrument / golovki-tortsevye	structure/d_ruchnoy-instrument/d_golovki-tortsevye	4
6	1/2" короткие	1-2-korotkie	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-2-korotkie	structure / ruchnoy-instrument / golovki-tortsevye / 1-2-korotkie	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-2-korotkie	5
7	12-граней	12-graney	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-2-korotkie/d_12-graney	structure / ruchnoy-instrument / golovki-tortsevye / 1-2-korotkie / 12-graney	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-2-korotkie/d_12-graney	6
9	6-граней	6-graney	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-2-korotkie/d_6-graney	structure / ruchnoy-instrument / golovki-tortsevye / 1-2-korotkie / 6-graney	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-2-korotkie/d_6-graney	6
10	Биты	bity	structure/d_bity	structure / bity	structure/d_bity	\N
11	10мм	10mm	structure/d_bity/d_10mm	structure / bity / 10mm	structure/d_bity/d_10mm	10
12	из наборов	iz-naborov	structure/d_bity/d_iz-naborov	structure / bity / iz-naborov	structure/d_bity/d_iz-naborov	10
13	1/2_запрессованные	1-2-zapressovannye	structure/d_bity/d_1-2-zapressovannye	structure / bity / 1-2-zapressovannye	structure/d_bity/d_1-2-zapressovannye	10
14	3/8_запрессованные	3-8-zapressovannye	structure/d_bity/d_3-8-zapressovannye	structure / bity / 3-8-zapressovannye	structure/d_bity/d_3-8-zapressovannye	10
15	длинные	dlinnye	structure/d_bity/d_10mm/d_dlinnye	structure / bity / 10mm / dlinnye	structure/d_bity/d_10mm/d_dlinnye	11
16	короткие	korotkie	structure/d_bity/d_10mm/d_korotkie	structure / bity / 10mm / korotkie	structure/d_bity/d_10mm/d_korotkie	11
17	Torx_17675	torx-17675	structure/d_bity/d_10mm/d_dlinnye/d_torx-17675	structure / bity / 10mm / dlinnye / torx-17675	structure/d_bity/d_10mm/d_dlinnye/d_torx-17675	15
18	Адаптеры/переходники	adaptery-perehodniki	structure/d_ruchnoy-instrument/d_adaptery-perehodniki	structure / ruchnoy-instrument / adaptery-perehodniki	structure/d_ruchnoy-instrument/d_adaptery-perehodniki	4
19	Переходник 3/8	perehodnik-3-8	structure/d_ruchnoy-instrument/d_adaptery-perehodniki/d_perehodnik-3-8	structure / ruchnoy-instrument / adaptery-perehodniki / perehodnik-3-8	structure/d_ruchnoy-instrument/d_adaptery-perehodniki/d_perehodnik-3-8	18
20	torx-17630	torx-17630	structure/d_bity/d_10mm/d_korotkie/d_torx-17630	structure / bity / 10mm / korotkie / torx-17630	structure/d_bity/d_10mm/d_korotkie/d_torx-17630	16
21	hex-17475	hex-17475	structure/d_bity/d_10mm/d_dlinnye/d_hex-17475	structure / bity / 10mm / dlinnye / hex-17475	structure/d_bity/d_10mm/d_dlinnye/d_hex-17475	15
22	spline-17875	spline-17875	structure/d_bity/d_10mm/d_dlinnye/d_spline-17875	structure / bity / 10mm / dlinnye / spline-17875	structure/d_bity/d_10mm/d_dlinnye/d_spline-17875	15
23	ribe-17975	ribe-17975	structure/d_bity/d_10mm/d_dlinnye/d_ribe-17975	structure / bity / 10mm / dlinnye / ribe-17975	structure/d_bity/d_10mm/d_dlinnye/d_ribe-17975	15
24	hex-17430	hex-17430	structure/d_bity/d_10mm/d_korotkie/d_hex-17430	structure / bity / 10mm / korotkie / hex-17430	structure/d_bity/d_10mm/d_korotkie/d_hex-17430	16
25	spine-17830	spine-17830	structure/d_bity/d_10mm/d_korotkie/d_spine-17830	structure / bity / 10mm / korotkie / spine-17830	structure/d_bity/d_10mm/d_korotkie/d_spine-17830	16
26	Оборудование	oborudovanie	structure/d_oborudovanie	structure / oborudovanie	structure/d_oborudovanie	\N
27	Для замены тех. жидкостей, смазка	dlya-zameny-teh-zhidkostey-smazka	structure/d_oborudovanie/d_dlya-zameny-teh-zhidkostey-smazka	structure / oborudovanie / dlya-zameny-teh-zhidkostey-smazka	structure/d_oborudovanie/d_dlya-zameny-teh-zhidkostey-smazka	26
28	Слив/откачка масла	sliv-otkachka-masla	structure/d_oborudovanie/d_dlya-zameny-teh-zhidkostey-smazka/d_sliv-otkachka-masla	structure / oborudovanie / dlya-zameny-teh-zhidkostey-smazka / sliv-otkachka-masla	structure/d_oborudovanie/d_dlya-zameny-teh-zhidkostey-smazka/d_sliv-otkachka-masla	27
29	ТАЗИКИ	taziki	structure/d_oborudovanie/d_dlya-zameny-teh-zhidkostey-smazka/d_sliv-otkachka-masla/d_taziki	structure / oborudovanie / dlya-zameny-teh-zhidkostey-smazka / sliv-otkachka-masla / taziki	structure/d_oborudovanie/d_dlya-zameny-teh-zhidkostey-smazka/d_sliv-otkachka-masla/d_taziki	28
30	Общестроительный инструмент	obschestroitel-nyy-instrument	structure/d_ruchnoy-instrument/d_obschestroitel-nyy-instrument	structure / ruchnoy-instrument / obschestroitel-nyy-instrument	structure/d_ruchnoy-instrument/d_obschestroitel-nyy-instrument	4
31	Заклепочники	zaklepochniki	structure/d_ruchnoy-instrument/d_obschestroitel-nyy-instrument/d_zaklepochniki	structure / ruchnoy-instrument / obschestroitel-nyy-instrument / zaklepochniki	structure/d_ruchnoy-instrument/d_obschestroitel-nyy-instrument/d_zaklepochniki	30
32	Вытяжной	vytyazhnoy	structure/d_ruchnoy-instrument/d_obschestroitel-nyy-instrument/d_zaklepochniki/d_vytyazhnoy	structure / ruchnoy-instrument / obschestroitel-nyy-instrument / zaklepochniki / vytyazhnoy	structure/d_ruchnoy-instrument/d_obschestroitel-nyy-instrument/d_zaklepochniki/d_vytyazhnoy	31
33	Резьбовой	rez-bovoy	structure/d_ruchnoy-instrument/d_obschestroitel-nyy-instrument/d_zaklepochniki/d_rez-bovoy	structure / ruchnoy-instrument / obschestroitel-nyy-instrument / zaklepochniki / rez-bovoy	structure/d_ruchnoy-instrument/d_obschestroitel-nyy-instrument/d_zaklepochniki/d_rez-bovoy	31
35	1/2 длинные	1-2-dlinnye	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-2-dlinnye	structure / ruchnoy-instrument / golovki-tortsevye / 1-2-dlinnye	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-2-dlinnye	5
36	1/4 короткие	1-4-korotkie	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-4-korotkie	structure / ruchnoy-instrument / golovki-tortsevye / 1-4-korotkie	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-4-korotkie	5
37	1/4 длинные	1-4-dlinnye	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-4-dlinnye	structure / ruchnoy-instrument / golovki-tortsevye / 1-4-dlinnye	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-4-dlinnye	5
38	3/8 короткие	3-8-korotkie	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_3-8-korotkie	structure / ruchnoy-instrument / golovki-tortsevye / 3-8-korotkie	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_3-8-korotkie	5
39	3/8 длинные	3-8-dlinnye	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_3-8-dlinnye	structure / ruchnoy-instrument / golovki-tortsevye / 3-8-dlinnye	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_3-8-dlinnye	5
40	3/4 короткие	3-4-korotkie	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_3-4-korotkie	structure / ruchnoy-instrument / golovki-tortsevye / 3-4-korotkie	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_3-4-korotkie	5
41	3/4 длинные	3-4-dlinnye	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_3-4-dlinnye	structure / ruchnoy-instrument / golovki-tortsevye / 3-4-dlinnye	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_3-4-dlinnye	5
42	1 дюйм короткие	1-dyuym-korotkie	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-dyuym-korotkie	structure / ruchnoy-instrument / golovki-tortsevye / 1-dyuym-korotkie	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-dyuym-korotkie	5
43	1 дюйм длинные	1-dyuym-dlinnye	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-dyuym-dlinnye	structure / ruchnoy-instrument / golovki-tortsevye / 1-dyuym-dlinnye	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-dyuym-dlinnye	5
44	Металлообработка	metalloobrabotka	structure/d_metalloobrabotka	structure / metalloobrabotka	structure/d_metalloobrabotka	\N
45	Экстракторы	ekstraktory	structure/d_metalloobrabotka/d_ekstraktory	structure / metalloobrabotka / ekstraktory	structure/d_metalloobrabotka/d_ekstraktory	44
46	Экстракторы головки	ekstraktory-golovki	structure/d_metalloobrabotka/d_ekstraktory/d_ekstraktory-golovki	structure / metalloobrabotka / ekstraktory / ekstraktory-golovki	structure/d_metalloobrabotka/d_ekstraktory/d_ekstraktory-golovki	45
47	Экстракторы Шпильки	ekstraktory-shpil-ki	structure/d_metalloobrabotka/d_ekstraktory/d_ekstraktory-shpil-ki	structure / metalloobrabotka / ekstraktory / ekstraktory-shpil-ki	structure/d_metalloobrabotka/d_ekstraktory/d_ekstraktory-shpil-ki	45
48	1/4 запрессованные	1-4-zapressovannye	structure/d_bity/d_iz-naborov/d_1-4-zapressovannye	structure / bity / iz-naborov / 1-4-zapressovannye	structure/d_bity/d_iz-naborov/d_1-4-zapressovannye	12
50	6граней	6graney	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-2-dlinnye/d_6graney	structure / ruchnoy-instrument / golovki-tortsevye / 1-2-dlinnye / 6graney	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-2-dlinnye/d_6graney	35
51	Специальный инструмент	spetsial-nyy-instrument	structure/d_spetsial-nyy-instrument	structure / spetsial-nyy-instrument	structure/d_spetsial-nyy-instrument	\N
52	салон	salon	structure/d_spetsial-nyy-instrument/d_salon	structure / spetsial-nyy-instrument / salon	structure/d_spetsial-nyy-instrument/d_salon	51
53	Съемник пистонов	s-emnik-pistonov	structure/d_spetsial-nyy-instrument/d_salon/d_s-emnik-pistonov	structure / spetsial-nyy-instrument / salon / s-emnik-pistonov	structure/d_spetsial-nyy-instrument/d_salon/d_s-emnik-pistonov	52
54	ПЛАСТИКОВЫЕ НАБОРЫ	plastikovye-nabory	structure/d_spetsial-nyy-instrument/d_salon/d_plastikovye-nabory	structure / spetsial-nyy-instrument / salon / plastikovye-nabory	structure/d_spetsial-nyy-instrument/d_salon/d_plastikovye-nabory	52
55	Головки: наборы	golovki-nabory	structure/d_ruchnoy-instrument/d_golovki-nabory	structure / ruchnoy-instrument / golovki-nabory	structure/d_ruchnoy-instrument/d_golovki-nabory	4
56	1/2" ударные удлиненные	1-2-udarnye-udlinennye	structure/d_ruchnoy-instrument/d_golovki-nabory/d_1-2-udarnye-udlinennye	structure / ruchnoy-instrument / golovki-nabory / 1-2-udarnye-udlinennye	structure/d_ruchnoy-instrument/d_golovki-nabory/d_1-2-udarnye-udlinennye	55
57	1/2" ударные короткие	1-2-udarnye-korotkie	structure/d_ruchnoy-instrument/d_golovki-nabory/d_1-2-udarnye-korotkie	structure / ruchnoy-instrument / golovki-nabory / 1-2-udarnye-korotkie	structure/d_ruchnoy-instrument/d_golovki-nabory/d_1-2-udarnye-korotkie	55
58	1/2" ударные длинные + короткие	1-2-udarnye-dlinnye-korotkie	structure/d_ruchnoy-instrument/d_golovki-nabory/d_1-2-udarnye-dlinnye-korotkie	structure / ruchnoy-instrument / golovki-nabory / 1-2-udarnye-dlinnye-korotkie	structure/d_ruchnoy-instrument/d_golovki-nabory/d_1-2-udarnye-dlinnye-korotkie	55
59	замена масла	zamena-masla	structure/d_spetsial-nyy-instrument/d_zamena-masla	structure / spetsial-nyy-instrument / zamena-masla	structure/d_spetsial-nyy-instrument/d_zamena-masla	51
60	универсальные съемники масляных фильтров	universal-nye-s-emniki-maslyanyh-fil-trov	structure/d_spetsial-nyy-instrument/d_zamena-masla/d_universal-nye-s-emniki-maslyanyh-fil-trov	structure / spetsial-nyy-instrument / zamena-masla / universal-nye-s-emniki-maslyanyh-fil-trov	structure/d_spetsial-nyy-instrument/d_zamena-masla/d_universal-nye-s-emniki-maslyanyh-fil-trov	59
61	ременной	remennoy	structure/d_spetsial-nyy-instrument/d_zamena-masla/d_universal-nye-s-emniki-maslyanyh-fil-trov/d_remennoy	structure / spetsial-nyy-instrument / zamena-masla / universal-nye-s-emniki-maslyanyh-fil-trov / remennoy	structure/d_spetsial-nyy-instrument/d_zamena-masla/d_universal-nye-s-emniki-maslyanyh-fil-trov/d_remennoy	60
62	Ходовая часть	hodovaya-chast	structure/d_spetsial-nyy-instrument/d_hodovaya-chast	structure / spetsial-nyy-instrument / hodovaya-chast	structure/d_spetsial-nyy-instrument/d_hodovaya-chast	51
63	Сайлентблоки	saylentbloki	structure/d_spetsial-nyy-instrument/d_hodovaya-chast/d_saylentbloki	structure / spetsial-nyy-instrument / hodovaya-chast / saylentbloki	structure/d_spetsial-nyy-instrument/d_hodovaya-chast/d_saylentbloki	62
64	набор для разбора сайлентблоков	nabor-dlya-razbora-saylentblokov	structure/d_spetsial-nyy-instrument/d_hodovaya-chast/d_saylentbloki/d_nabor-dlya-razbora-saylentblokov	structure / spetsial-nyy-instrument / hodovaya-chast / saylentbloki / nabor-dlya-razbora-saylentblokov	structure/d_spetsial-nyy-instrument/d_hodovaya-chast/d_saylentbloki/d_nabor-dlya-razbora-saylentblokov	63
65	шпильки	shpil-ki	structure/d_spetsial-nyy-instrument/d_hodovaya-chast/d_saylentbloki/d_shpil-ki	structure / spetsial-nyy-instrument / hodovaya-chast / saylentbloki / shpil-ki	structure/d_spetsial-nyy-instrument/d_hodovaya-chast/d_saylentbloki/d_shpil-ki	63
66	ШАРНИР-УДАРНЫЙ	sharnir-udarnyy	structure/d_ruchnoy-instrument/d_adaptery-perehodniki/d_sharnir-udarnyy	structure / ruchnoy-instrument / adaptery-perehodniki / sharnir-udarnyy	structure/d_ruchnoy-instrument/d_adaptery-perehodniki/d_sharnir-udarnyy	18
67	Двигатель	dvigatel	structure/d_spetsial-nyy-instrument/d_dvigatel	structure / spetsial-nyy-instrument / dvigatel	structure/d_spetsial-nyy-instrument/d_dvigatel	51
68	датчики	datchiki	structure/d_spetsial-nyy-instrument/d_dvigatel/d_datchiki	structure / spetsial-nyy-instrument / dvigatel / datchiki	structure/d_spetsial-nyy-instrument/d_dvigatel/d_datchiki	67
69	лямбда	lyambda	structure/d_spetsial-nyy-instrument/d_dvigatel/d_datchiki/d_lyambda	structure / spetsial-nyy-instrument / dvigatel / datchiki / lyambda	structure/d_spetsial-nyy-instrument/d_dvigatel/d_datchiki/d_lyambda	68
70	Трещотки	treschotki	structure/d_ruchnoy-instrument/d_treschotki	structure / ruchnoy-instrument / treschotki	structure/d_ruchnoy-instrument/d_treschotki	4
71	1/4" Трещотки	1-4-treschotki	structure/d_ruchnoy-instrument/d_treschotki/d_1-4-treschotki	structure / ruchnoy-instrument / treschotki / 1-4-treschotki	structure/d_ruchnoy-instrument/d_treschotki/d_1-4-treschotki	70
72	1/2" Трещотки	1-2-treschotki	structure/d_ruchnoy-instrument/d_treschotki/d_1-2-treschotki	structure / ruchnoy-instrument / treschotki / 1-2-treschotki	structure/d_ruchnoy-instrument/d_treschotki/d_1-2-treschotki	70
73	3/8" Трещотки	3-8-treschotki	structure/d_ruchnoy-instrument/d_treschotki/d_3-8-treschotki	structure / ruchnoy-instrument / treschotki / 3-8-treschotki	structure/d_ruchnoy-instrument/d_treschotki/d_3-8-treschotki	70
74	Ключи	klyuchi	structure/d_ruchnoy-instrument/d_klyuchi	structure / ruchnoy-instrument / klyuchi	structure/d_ruchnoy-instrument/d_klyuchi	4
75	Комбинированные наборы	kombinirovannye-nabory	structure/d_ruchnoy-instrument/d_klyuchi/d_kombinirovannye-nabory	structure / ruchnoy-instrument / klyuchi / kombinirovannye-nabory	structure/d_ruchnoy-instrument/d_klyuchi/d_kombinirovannye-nabory	74
77	радиусные	radiusnye	structure/d_ruchnoy-instrument/d_klyuchi/d_radiusnye	structure / ruchnoy-instrument / klyuchi / radiusnye	structure/d_ruchnoy-instrument/d_klyuchi/d_radiusnye	74
78	Трещоточные	treschotochnye	structure/d_ruchnoy-instrument/d_klyuchi/d_treschotochnye	structure / ruchnoy-instrument / klyuchi / treschotochnye	structure/d_ruchnoy-instrument/d_klyuchi/d_treschotochnye	74
79	Накидные наборы	nakidnye-nabory	structure/d_ruchnoy-instrument/d_klyuchi/d_nakidnye-nabory	structure / ruchnoy-instrument / klyuchi / nakidnye-nabory	structure/d_ruchnoy-instrument/d_klyuchi/d_nakidnye-nabory	74
80	Наборы инструментов	nabory-instrumentov	structure/d_ruchnoy-instrument/d_nabory-instrumentov	structure / ruchnoy-instrument / nabory-instrumentov	structure/d_ruchnoy-instrument/d_nabory-instrumentov	4
81	1/4" и 1/2"	1-4-i-1-2	structure/d_ruchnoy-instrument/d_nabory-instrumentov/d_1-4-i-1-2	structure / ruchnoy-instrument / nabory-instrumentov / 1-4-i-1-2	structure/d_ruchnoy-instrument/d_nabory-instrumentov/d_1-4-i-1-2	80
82	БЕГУНКИ (Адаптер-переходник 3/8''(F)x1/2''(M))	begunki-adapter-perehodnik-3-8-f-x1-2-m	structure/d_ruchnoy-instrument/d_adaptery-perehodniki/d_begunki-adapter-perehodnik-3-8-f-x1-2-m	structure / ruchnoy-instrument / adaptery-perehodniki / begunki-adapter-perehodnik-3-8-f-x1-2-m	structure/d_ruchnoy-instrument/d_adaptery-perehodniki/d_begunki-adapter-perehodnik-3-8-f-x1-2-m	18
83	1/2 короткие ударные	1-2-korotkie-udarnye	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-2-korotkie/d_1-2-korotkie-udarnye	structure / ruchnoy-instrument / golovki-tortsevye / 1-2-korotkie / 1-2-korotkie-udarnye	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-2-korotkie/d_1-2-korotkie-udarnye	6
84	1/2 длинные ударные	1-2-dlinnye-udarnye	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-2-dlinnye/d_1-2-dlinnye-udarnye	structure / ruchnoy-instrument / golovki-tortsevye / 1-2-dlinnye / 1-2-dlinnye-udarnye	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-2-dlinnye/d_1-2-dlinnye-udarnye	35
85	6гр	6gr	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-2-korotkie/d_1-2-korotkie-udarnye/d_6gr	structure / ruchnoy-instrument / golovki-tortsevye / 1-2-korotkie / 1-2-korotkie-udarnye / 6gr	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-2-korotkie/d_1-2-korotkie-udarnye/d_6gr	83
86	12гр	12gr	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-2-korotkie/d_1-2-korotkie-udarnye/d_12gr	structure / ruchnoy-instrument / golovki-tortsevye / 1-2-korotkie / 1-2-korotkie-udarnye / 12gr	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-2-korotkie/d_1-2-korotkie-udarnye/d_12gr	83
87	продувочные	produvochnye	structure/d_pnevmatika/d_instrument/d_produvochnye	structure / pnevmatika / instrument / produvochnye	structure/d_pnevmatika/d_instrument/d_produvochnye	2
88	свечные головки	svechnye-golovki	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_svechnye-golovki	structure / ruchnoy-instrument / golovki-tortsevye / svechnye-golovki	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_svechnye-golovki	5
89	ВОРОТКИ Г-обр	vorotki-g-obr	structure/d_ruchnoy-instrument/d_vorotki-g-obr	structure / ruchnoy-instrument / vorotki-g-obr	structure/d_ruchnoy-instrument/d_vorotki-g-obr	4
90	1/4-вороток-Гобразный	1-4-vorotok-gobraznyy	structure/d_ruchnoy-instrument/d_vorotki-g-obr/d_1-4-vorotok-gobraznyy	structure / ruchnoy-instrument / vorotki-g-obr / 1-4-vorotok-gobraznyy	structure/d_ruchnoy-instrument/d_vorotki-g-obr/d_1-4-vorotok-gobraznyy	89
91	3/8-вороток-Гобразный	3-8-vorotok-gobraznyy	structure/d_ruchnoy-instrument/d_vorotki-g-obr/d_3-8-vorotok-gobraznyy	structure / ruchnoy-instrument / vorotki-g-obr / 3-8-vorotok-gobraznyy	structure/d_ruchnoy-instrument/d_vorotki-g-obr/d_3-8-vorotok-gobraznyy	89
92	1/2-вороток-Гобразный	1-2-vorotok-gobraznyy	structure/d_ruchnoy-instrument/d_vorotki-g-obr/d_1-2-vorotok-gobraznyy	structure / ruchnoy-instrument / vorotki-g-obr / 1-2-vorotok-gobraznyy	structure/d_ruchnoy-instrument/d_vorotki-g-obr/d_1-2-vorotok-gobraznyy	89
93	3/4-вороток-Гобразный	3-4-vorotok-gobraznyy	structure/d_ruchnoy-instrument/d_vorotki-g-obr/d_3-4-vorotok-gobraznyy	structure / ruchnoy-instrument / vorotki-g-obr / 3-4-vorotok-gobraznyy	structure/d_ruchnoy-instrument/d_vorotki-g-obr/d_3-4-vorotok-gobraznyy	89
94	1_duim-вороток-Гобразный	1-duim-vorotok-gobraznyy	structure/d_ruchnoy-instrument/d_vorotki-g-obr/d_1-duim-vorotok-gobraznyy	structure / ruchnoy-instrument / vorotki-g-obr / 1-duim-vorotok-gobraznyy	structure/d_ruchnoy-instrument/d_vorotki-g-obr/d_1-duim-vorotok-gobraznyy	89
95	Щетки ручные	schetki-ruchnye	structure/d_metalloobrabotka/d_schetki-ruchnye	structure / metalloobrabotka / schetki-ruchnye	structure/d_metalloobrabotka/d_schetki-ruchnye	44
96	наборы бит 1/4-1/4	nabory-bit-1-4-1-4	structure/d_bity/d_nabory-bit-1-4-1-4	structure / bity / nabory-bit-1-4-1-4	structure/d_bity/d_nabory-bit-1-4-1-4	10
97	комбинир. поштучно	kombinir-poshtuchno	structure/d_ruchnoy-instrument/d_klyuchi/d_kombinir-poshtuchno	structure / ruchnoy-instrument / klyuchi / kombinir-poshtuchno	structure/d_ruchnoy-instrument/d_klyuchi/d_kombinir-poshtuchno	74
98	Монтировки	montirovki	structure/d_ruchnoy-instrument/d_montirovki	structure / ruchnoy-instrument / montirovki	structure/d_ruchnoy-instrument/d_montirovki	4
99	монтировки с рукояткой	montirovki-s-rukoyatkoy	structure/d_ruchnoy-instrument/d_montirovki/d_montirovki-s-rukoyatkoy	structure / ruchnoy-instrument / montirovki / montirovki-s-rukoyatkoy	structure/d_ruchnoy-instrument/d_montirovki/d_montirovki-s-rukoyatkoy	98
100	монтировка шинамонтажная	montirovka-shinamontazhnaya	structure/d_ruchnoy-instrument/d_montirovki/d_montirovka-shinamontazhnaya	structure / ruchnoy-instrument / montirovki / montirovka-shinamontazhnaya	structure/d_ruchnoy-instrument/d_montirovki/d_montirovka-shinamontazhnaya	98
101	КЛЮЧ (кочерга)	klyuch-kocherga	structure/d_spetsial-nyy-instrument/d_zamena-masla/d_klyuch-kocherga	structure / spetsial-nyy-instrument / zamena-masla / klyuch-kocherga	structure/d_spetsial-nyy-instrument/d_zamena-masla/d_klyuch-kocherga	59
102	ключ-головка (квадрат 1/2)	klyuch-golovka-kvadrat-1-2	structure/d_spetsial-nyy-instrument/d_zamena-masla/d_klyuch-golovka-kvadrat-1-2	structure / spetsial-nyy-instrument / zamena-masla / klyuch-golovka-kvadrat-1-2	structure/d_spetsial-nyy-instrument/d_zamena-masla/d_klyuch-golovka-kvadrat-1-2	59
103	Измерительный	izmeritel-nyy	structure/d_ruchnoy-instrument/d_izmeritel-nyy	structure / ruchnoy-instrument / izmeritel-nyy	structure/d_ruchnoy-instrument/d_izmeritel-nyy	4
104	ДИНАМОМЕТРИЧЕСКИЕ КЛЮЧИ	dinamometricheskie-klyuchi	structure/d_ruchnoy-instrument/d_izmeritel-nyy/d_dinamometricheskie-klyuchi	structure / ruchnoy-instrument / izmeritel-nyy / dinamometricheskie-klyuchi	structure/d_ruchnoy-instrument/d_izmeritel-nyy/d_dinamometricheskie-klyuchi	103
106	РУЧНЫЕ ТРЕЩОТКИ	ruchnye-treschotki	structure/d_ruchnye-treschotki	structure / ruchnye-treschotki	structure/d_ruchnye-treschotki	\N
108	трещотки ручные 1/4	treschotki-ruchnye-1-4	structure/d_ruchnye-treschotki/d_treschotki-ruchnye-1-4	structure / ruchnye-treschotki / treschotki-ruchnye-1-4	structure/d_ruchnye-treschotki/d_treschotki-ruchnye-1-4	106
109	трещотки ручные 3/8	treschotki-ruchnye-3-8	structure/d_ruchnye-treschotki/d_treschotki-ruchnye-3-8	structure / ruchnye-treschotki / treschotki-ruchnye-3-8	structure/d_ruchnye-treschotki/d_treschotki-ruchnye-3-8	106
110	трещотки ручные 1/2	treschotki-ruchnye-1-2	structure/d_ruchnye-treschotki/d_treschotki-ruchnye-1-2	structure / ruchnye-treschotki / treschotki-ruchnye-1-2	structure/d_ruchnye-treschotki/d_treschotki-ruchnye-1-2	106
111	Метчики, плашки, воротки	metchiki-plashki-vorotki	structure/d_metalloobrabotka/d_metchiki-plashki-vorotki	structure / metalloobrabotka / metchiki-plashki-vorotki	structure/d_metalloobrabotka/d_metchiki-plashki-vorotki	44
112	Метчики наборы	metchiki-nabory	structure/d_metalloobrabotka/d_metchiki-plashki-vorotki/d_metchiki-nabory	structure / metalloobrabotka / metchiki-plashki-vorotki / metchiki-nabory	structure/d_metalloobrabotka/d_metchiki-plashki-vorotki/d_metchiki-nabory	111
113	Метчики поштучно	metchiki-poshtuchno	structure/d_metalloobrabotka/d_metchiki-plashki-vorotki/d_metchiki-poshtuchno	structure / metalloobrabotka / metchiki-plashki-vorotki / metchiki-poshtuchno	structure/d_metalloobrabotka/d_metchiki-plashki-vorotki/d_metchiki-poshtuchno	111
114	Плашки наборы	plashki-nabory	structure/d_metalloobrabotka/d_metchiki-plashki-vorotki/d_plashki-nabory	structure / metalloobrabotka / metchiki-plashki-vorotki / plashki-nabory	structure/d_metalloobrabotka/d_metchiki-plashki-vorotki/d_plashki-nabory	111
115	Плашки поштучно	plashki-poshtuchno	structure/d_metalloobrabotka/d_metchiki-plashki-vorotki/d_plashki-poshtuchno	structure / metalloobrabotka / metchiki-plashki-vorotki / plashki-poshtuchno	structure/d_metalloobrabotka/d_metchiki-plashki-vorotki/d_plashki-poshtuchno	111
116	Шарнирно-губцевый	sharnirno-gubtsevyy	structure/d_ruchnoy-instrument/d_sharnirno-gubtsevyy	structure / ruchnoy-instrument / sharnirno-gubtsevyy	structure/d_ruchnoy-instrument/d_sharnirno-gubtsevyy	4
117	КЛЕЩИ ПЕРЕСТАВНЫЕ	kleschi-perestavnye	structure/d_ruchnoy-instrument/d_sharnirno-gubtsevyy/d_kleschi-perestavnye	structure / ruchnoy-instrument / sharnirno-gubtsevyy / kleschi-perestavnye	structure/d_ruchnoy-instrument/d_sharnirno-gubtsevyy/d_kleschi-perestavnye	116
118	ТЯГИ	tyagi	structure/d_spetsial-nyy-instrument/d_hodovaya-chast/d_tyagi	structure / spetsial-nyy-instrument / hodovaya-chast / tyagi	structure/d_spetsial-nyy-instrument/d_hodovaya-chast/d_tyagi	62
120	съемники	s-emniki	structure/d_spetsial-nyy-instrument/d_s-emniki	structure / spetsial-nyy-instrument / s-emniki	structure/d_spetsial-nyy-instrument/d_s-emniki	51
121	СЪЕМНИК ДВОРНИКОВ	s-emnik-dvornikov	structure/d_spetsial-nyy-instrument/d_s-emniki/d_s-emnik-dvornikov	structure / spetsial-nyy-instrument / s-emniki / s-emnik-dvornikov	structure/d_spetsial-nyy-instrument/d_s-emniki/d_s-emnik-dvornikov	120
122	Битодержатели-рукоятки	bitoderzhateli-rukoyatki	structure/d_ruchnoy-instrument/d_bitoderzhateli-rukoyatki	structure / ruchnoy-instrument / bitoderzhateli-rukoyatki	structure/d_ruchnoy-instrument/d_bitoderzhateli-rukoyatki	4
123	отбойные молотки	otboynye-molotki	structure/d_pnevmatika/d_instrument/d_otboynye-molotki	structure / pnevmatika / instrument / otboynye-molotki	structure/d_pnevmatika/d_instrument/d_otboynye-molotki	2
124	зубила	zubila	structure/d_pnevmatika/d_instrument/d_otboynye-molotki/d_zubila	structure / pnevmatika / instrument / otboynye-molotki / zubila	structure/d_pnevmatika/d_instrument/d_otboynye-molotki/d_zubila	123
127	perehodnik-1/2 -	perehodnik-1-2	structure/d_ruchnoy-instrument/d_adaptery-perehodniki/d_perehodnik-1-2	structure / ruchnoy-instrument / adaptery-perehodniki / perehodnik-1-2	structure/d_ruchnoy-instrument/d_adaptery-perehodniki/d_perehodnik-1-2	18
128	Головки E-профиль	golovki-e-profil	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_golovki-e-profil	structure / ruchnoy-instrument / golovki-tortsevye / golovki-e-profil	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_golovki-e-profil	5
129	головки E-профиль наборы	golovki-e-profil-nabory	structure/d_ruchnoy-instrument/d_golovki-nabory/d_golovki-e-profil-nabory	structure / ruchnoy-instrument / golovki-nabory / golovki-e-profil-nabory	structure/d_ruchnoy-instrument/d_golovki-nabory/d_golovki-e-profil-nabory	55
130	е-1/4-поштучно	e-1-4-poshtuchno	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_golovki-e-profil/d_e-1-4-poshtuchno	structure / ruchnoy-instrument / golovki-tortsevye / golovki-e-profil / e-1-4-poshtuchno	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_golovki-e-profil/d_e-1-4-poshtuchno	128
131	е-3/8-поштучно	e-3-8-poshtuchno	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_golovki-e-profil/d_e-3-8-poshtuchno	structure / ruchnoy-instrument / golovki-tortsevye / golovki-e-profil / e-3-8-poshtuchno	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_golovki-e-profil/d_e-3-8-poshtuchno	128
132	е-1/2-поштучно	e-1-2-poshtuchno	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_golovki-e-profil/d_e-1-2-poshtuchno	structure / ruchnoy-instrument / golovki-tortsevye / golovki-e-profil / e-1-2-poshtuchno	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_golovki-e-profil/d_e-1-2-poshtuchno	128
133	гайколомы-гайкоколы	gaykolomy-gaykokoly	structure/d_spetsial-nyy-instrument/d_gaykolomy-gaykokoly	structure / spetsial-nyy-instrument / gaykolomy-gaykokoly	structure/d_spetsial-nyy-instrument/d_gaykolomy-gaykokoly	51
134	ГБЦ	gbts	structure/d_spetsial-nyy-instrument/d_dvigatel/d_gbts	structure / spetsial-nyy-instrument / dvigatel / gbts	structure/d_spetsial-nyy-instrument/d_dvigatel/d_gbts	67
135	ПРИТИРКА КЛАПАНОВ	pritirka-klapanov	structure/d_spetsial-nyy-instrument/d_dvigatel/d_gbts/d_pritirka-klapanov	structure / spetsial-nyy-instrument / dvigatel / gbts / pritirka-klapanov	structure/d_spetsial-nyy-instrument/d_dvigatel/d_gbts/d_pritirka-klapanov	134
136	Г образные ключи HEX/TORX	g-obraznye-klyuchi-hex-torx	structure/d_ruchnoy-instrument/d_g-obraznye-klyuchi-hex-torx	structure / ruchnoy-instrument / g-obraznye-klyuchi-hex-torx	structure/d_ruchnoy-instrument/d_g-obraznye-klyuchi-hex-torx	4
137	зубило	zubilo	structure/d_metalloobrabotka/d_zubilo	structure / metalloobrabotka / zubilo	structure/d_metalloobrabotka/d_zubilo	44
138	УДАРНЫЕ АДАПТЕРЫ	udarnye-adaptery	structure/d_ruchnoy-instrument/d_adaptery-perehodniki/d_udarnye-adaptery	structure / ruchnoy-instrument / adaptery-perehodniki / udarnye-adaptery	structure/d_ruchnoy-instrument/d_adaptery-perehodniki/d_udarnye-adaptery	18
139	ПОДЬЕМНОЕ	pod-emnoe	structure/d_pod-emnoe	structure / pod-emnoe	structure/d_pod-emnoe	\N
140	ПОДСТАВКИ 2-3т	podstavki-2-3t	structure/d_pod-emnoe/d_podstavki-2-3t	structure / pod-emnoe / podstavki-2-3t	structure/d_pod-emnoe/d_podstavki-2-3t	139
141	ШРУС	shrus	structure/d_spetsial-nyy-instrument/d_hodovaya-chast/d_shrus	structure / spetsial-nyy-instrument / hodovaya-chast / shrus	structure/d_spetsial-nyy-instrument/d_hodovaya-chast/d_shrus	62
142	СЪЕМНИК ШРУСА	s-emnik-shrusa	structure/d_spetsial-nyy-instrument/d_hodovaya-chast/d_shrus/d_s-emnik-shrusa	structure / spetsial-nyy-instrument / hodovaya-chast / shrus / s-emnik-shrusa	structure/d_spetsial-nyy-instrument/d_hodovaya-chast/d_shrus/d_s-emnik-shrusa	141
143	Шарнирно-губцевый инструмент	sharnirno-gubtsevyy-instrument	structure/d_sharnirno-gubtsevyy-instrument	structure / sharnirno-gubtsevyy-instrument	structure/d_sharnirno-gubtsevyy-instrument	\N
144	Самозажимных хомутов	samozazhimnyh-homutov	structure/d_sharnirno-gubtsevyy-instrument/d_samozazhimnyh-homutov	structure / sharnirno-gubtsevyy-instrument / samozazhimnyh-homutov	structure/d_sharnirno-gubtsevyy-instrument/d_samozazhimnyh-homutov	143
145	ШПРИЦЫ	shpritsy	structure/d_oborudovanie/d_shpritsy	structure / oborudovanie / shpritsy	structure/d_oborudovanie/d_shpritsy	26
146	ШПРИЦЫ ЛИТОЛ	shpritsy-litol	structure/d_oborudovanie/d_shpritsy/d_shpritsy-litol	structure / oborudovanie / shpritsy / shpritsy-litol	structure/d_oborudovanie/d_shpritsy/d_shpritsy-litol	145
147	ШПРИЦЫ ДЛЯ МАСЛА	shpritsy-dlya-masla	structure/d_oborudovanie/d_shpritsy/d_shpritsy-dlya-masla	structure / oborudovanie / shpritsy / shpritsy-dlya-masla	structure/d_oborudovanie/d_shpritsy/d_shpritsy-dlya-masla	145
148	ОТВЕРТКИ	otvertki	structure/d_ruchnoy-instrument/d_otvertki	structure / ruchnoy-instrument / otvertki	structure/d_ruchnoy-instrument/d_otvertki	4
149	ударно-поворотные отвертки	udarno-povorotnye-otvertki	structure/d_ruchnoy-instrument/d_otvertki/d_udarno-povorotnye-otvertki	structure / ruchnoy-instrument / otvertki / udarno-povorotnye-otvertki	structure/d_ruchnoy-instrument/d_otvertki/d_udarno-povorotnye-otvertki	148
150	ударные отвертки	udarnye-otvertki	structure/d_ruchnoy-instrument/d_otvertki/d_udarnye-otvertki	structure / ruchnoy-instrument / otvertki / udarnye-otvertki	structure/d_ruchnoy-instrument/d_otvertki/d_udarnye-otvertki	148
151	отвертки TORX	otvertki-torx	structure/d_ruchnoy-instrument/d_otvertki/d_otvertki-torx	structure / ruchnoy-instrument / otvertki / otvertki-torx	structure/d_ruchnoy-instrument/d_otvertki/d_otvertki-torx	148
152	простые отвертки	prostye-otvertki	structure/d_ruchnoy-instrument/d_otvertki/d_prostye-otvertki	structure / ruchnoy-instrument / otvertki / prostye-otvertki	structure/d_ruchnoy-instrument/d_otvertki/d_prostye-otvertki	148
153	Воротки Шарнирные	vorotki-sharnirnye	structure/d_ruchnoy-instrument/d_vorotki-sharnirnye	structure / ruchnoy-instrument / vorotki-sharnirnye	structure/d_ruchnoy-instrument/d_vorotki-sharnirnye	4
154	Шарнирный 1/4	sharnirnyy-1-4	structure/d_ruchnoy-instrument/d_vorotki-sharnirnye/d_sharnirnyy-1-4	structure / ruchnoy-instrument / vorotki-sharnirnye / sharnirnyy-1-4	structure/d_ruchnoy-instrument/d_vorotki-sharnirnye/d_sharnirnyy-1-4	153
155	шарнирный 3/8	sharnirnyy-3-8	structure/d_ruchnoy-instrument/d_vorotki-sharnirnye/d_sharnirnyy-3-8	structure / ruchnoy-instrument / vorotki-sharnirnye / sharnirnyy-3-8	structure/d_ruchnoy-instrument/d_vorotki-sharnirnye/d_sharnirnyy-3-8	153
156	шарнирный 1/2	sharnirnyy-1-2	structure/d_ruchnoy-instrument/d_vorotki-sharnirnye/d_sharnirnyy-1-2	structure / ruchnoy-instrument / vorotki-sharnirnye / sharnirnyy-1-2	structure/d_ruchnoy-instrument/d_vorotki-sharnirnye/d_sharnirnyy-1-2	153
157	СТОПОРНЫЕ КОЛЬЦА	stopornye-kol-tsa	structure/d_ruchnoy-instrument/d_stopornye-kol-tsa	structure / ruchnoy-instrument / stopornye-kol-tsa	structure/d_ruchnoy-instrument/d_stopornye-kol-tsa	4
158	наборы-стопорных-колец	nabory-stopornyh-kolets	structure/d_ruchnoy-instrument/d_stopornye-kol-tsa/d_nabory-stopornyh-kolets	structure / ruchnoy-instrument / stopornye-kol-tsa / nabory-stopornyh-kolets	structure/d_ruchnoy-instrument/d_stopornye-kol-tsa/d_nabory-stopornyh-kolets	157
159	поштучно 175мм	poshtuchno-175mm	structure/d_ruchnoy-instrument/d_stopornye-kol-tsa/d_poshtuchno-175mm	structure / ruchnoy-instrument / stopornye-kol-tsa / poshtuchno-175mm	structure/d_ruchnoy-instrument/d_stopornye-kol-tsa/d_poshtuchno-175mm	157
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customers (id, name, phone, notes) FROM stdin;
\.


--
-- Data for Name: disassembly_scenarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.disassembly_scenarios (id, name, "partsCount", "isActive", "createdAt", "updatedAt", "childProductCodes", "parentProductCode") FROM stdin;
\.


--
-- Data for Name: inventory_forecasts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory_forecasts (id, "productUnitId", "forecastDate", "periodStart", "periodEnd", "periodType", "predictedSales", "recommendedOrder", confidence, "actualSales", accuracy, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: inventory_snapshots; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory_snapshots (id, "snapshotDate", "productUnitId", "statusProduct", "salePrice", "stockValue", "periodType", "createdAt") FROM stdin;
1	2025-10-23 21:00:00	\N	IN_STORE	27.49	54.98	daily	2025-10-24 12:47:02.776
2	2025-10-23 21:00:00	7	IN_STORE	\N	0	daily	2025-10-24 12:47:02.794
3	2025-10-23 21:00:00	6	IN_STORE	\N	0	daily	2025-10-24 12:47:02.795
4	2025-10-24 21:00:00	\N	IN_STORE	27.49	54.98	daily	2025-10-25 09:01:07.219
5	2025-10-24 21:00:00	\N	IN_STORE	3.06	15.3	daily	2025-10-25 09:01:07.236
6	2025-10-24 21:00:00	\N	IN_STORE	3.27	9.81	daily	2025-10-25 09:01:07.239
7	2025-10-24 21:00:00	\N	IN_STORE	1.74	3.48	daily	2025-10-25 09:01:07.286
8	2025-10-24 21:00:00	\N	IN_STORE	2.22	11.1	daily	2025-10-25 09:01:07.289
9	2025-10-24 21:00:00	\N	IN_STORE	21.54	21.54	daily	2025-10-25 09:01:07.292
10	2025-10-24 21:00:00	\N	IN_STORE	2.4	4.8	daily	2025-10-25 09:01:07.295
11	2025-10-24 21:00:00	\N	IN_STORE	3.22	3.22	daily	2025-10-25 09:01:07.297
12	2025-10-24 21:00:00	\N	IN_STORE	6.96	13.92	daily	2025-10-25 09:01:07.3
13	2025-10-24 21:00:00	\N	IN_STORE	23.04	23.04	daily	2025-10-25 09:01:07.302
14	2025-10-24 21:00:00	\N	IN_STORE	11.88	11.88	daily	2025-10-25 09:01:07.304
15	2025-10-24 21:00:00	\N	IN_STORE	2.16	17.28	daily	2025-10-25 09:01:07.306
16	2025-10-24 21:00:00	\N	IN_STORE	5.82	23.28	daily	2025-10-25 09:01:07.307
17	2025-10-24 21:00:00	\N	IN_STORE	3.22	3.22	daily	2025-10-25 09:01:07.31
18	2025-10-24 21:00:00	\N	IN_STORE	1	4	daily	2025-10-25 09:01:07.313
19	2025-10-24 21:00:00	\N	IN_STORE	2.16	8.64	daily	2025-10-25 09:01:07.316
20	2025-10-24 21:00:00	\N	IN_STORE	2.16	12.96	daily	2025-10-25 09:01:07.319
21	2025-10-24 21:00:00	10	IN_STORE	\N	0	daily	2025-10-25 09:01:07.324
22	2025-10-24 21:00:00	7	IN_STORE	\N	0	daily	2025-10-25 09:01:07.326
23	2025-10-24 21:00:00	11	IN_STORE	\N	0	daily	2025-10-25 09:01:07.327
24	2025-10-24 21:00:00	14	IN_STORE	\N	0	daily	2025-10-25 09:01:07.328
25	2025-10-24 21:00:00	6	IN_STORE	\N	0	daily	2025-10-25 09:01:07.329
26	2025-10-24 21:00:00	12	IN_STORE	\N	0	daily	2025-10-25 09:01:07.33
27	2025-10-24 21:00:00	19	IN_STORE	\N	0	daily	2025-10-25 09:01:07.331
28	2025-10-24 21:00:00	13	IN_STORE	\N	0	daily	2025-10-25 09:01:07.332
29	2025-10-24 21:00:00	18	IN_STORE	\N	0	daily	2025-10-25 09:01:07.333
30	2025-10-24 21:00:00	23	IN_STORE	\N	0	daily	2025-10-25 09:01:07.334
31	2025-10-24 21:00:00	24	IN_STORE	\N	0	daily	2025-10-25 09:01:07.335
32	2025-10-24 21:00:00	25	IN_STORE	\N	0	daily	2025-10-25 09:01:07.335
33	2025-10-24 21:00:00	28	IN_STORE	\N	0	daily	2025-10-25 09:01:07.336
34	2025-10-24 21:00:00	29	IN_STORE	\N	0	daily	2025-10-25 09:01:07.337
35	2025-10-24 21:00:00	30	IN_STORE	\N	0	daily	2025-10-25 09:01:07.338
36	2025-10-24 21:00:00	46	IN_STORE	\N	0	daily	2025-10-25 09:01:07.339
37	2025-10-24 21:00:00	31	IN_STORE	\N	0	daily	2025-10-25 09:01:07.34
38	2025-10-24 21:00:00	32	IN_STORE	\N	0	daily	2025-10-25 09:01:07.341
39	2025-10-24 21:00:00	33	IN_STORE	\N	0	daily	2025-10-25 09:01:07.342
40	2025-10-24 21:00:00	39	IN_STORE	\N	0	daily	2025-10-25 09:01:07.343
41	2025-10-24 21:00:00	41	IN_STORE	\N	0	daily	2025-10-25 09:01:07.344
42	2025-10-24 21:00:00	44	IN_STORE	\N	0	daily	2025-10-25 09:01:07.344
43	2025-10-24 21:00:00	40	IN_STORE	\N	0	daily	2025-10-25 09:01:07.345
44	2025-10-24 21:00:00	48	IN_STORE	\N	0	daily	2025-10-25 09:01:07.346
45	2025-10-24 21:00:00	43	IN_STORE	\N	0	daily	2025-10-25 09:01:07.347
46	2025-10-24 21:00:00	54	IN_STORE	\N	0	daily	2025-10-25 09:01:07.348
47	2025-10-24 21:00:00	53	IN_STORE	\N	0	daily	2025-10-25 09:01:07.348
48	2025-10-24 21:00:00	52	IN_STORE	\N	0	daily	2025-10-25 09:01:07.349
49	2025-10-24 21:00:00	64	IN_STORE	\N	0	daily	2025-10-25 09:01:07.35
50	2025-10-24 21:00:00	59	IN_STORE	\N	0	daily	2025-10-25 09:01:07.352
51	2025-10-24 21:00:00	58	IN_STORE	\N	0	daily	2025-10-25 09:01:07.353
52	2025-10-24 21:00:00	63	IN_STORE	\N	0	daily	2025-10-25 09:01:07.353
53	2025-10-24 21:00:00	57	IN_STORE	\N	0	daily	2025-10-25 09:01:07.354
54	2025-10-24 21:00:00	56	IN_STORE	\N	0	daily	2025-10-25 09:01:07.355
55	2025-10-24 21:00:00	55	IN_STORE	\N	0	daily	2025-10-25 09:01:07.356
56	2025-10-24 21:00:00	62	IN_STORE	\N	0	daily	2025-10-25 09:01:07.356
57	2025-10-24 21:00:00	65	IN_STORE	\N	0	daily	2025-10-25 09:01:07.357
58	2025-10-24 21:00:00	66	IN_STORE	\N	0	daily	2025-10-25 09:01:07.358
59	2025-10-24 21:00:00	73	IN_STORE	\N	0	daily	2025-10-25 09:01:07.359
60	2025-10-24 21:00:00	74	IN_STORE	\N	0	daily	2025-10-25 09:01:07.36
61	2025-10-24 21:00:00	75	IN_STORE	\N	0	daily	2025-10-25 09:01:07.363
62	2025-10-24 21:00:00	76	IN_STORE	\N	0	daily	2025-10-25 09:01:07.364
63	2025-10-24 21:00:00	79	IN_STORE	\N	0	daily	2025-10-25 09:01:07.365
64	2025-10-24 21:00:00	80	IN_STORE	\N	0	daily	2025-10-25 09:01:07.365
65	2025-10-24 21:00:00	81	IN_STORE	\N	0	daily	2025-10-25 09:01:07.366
66	2025-10-24 21:00:00	71	IN_STORE	\N	0	daily	2025-10-25 09:01:07.367
67	2025-10-24 21:00:00	72	IN_STORE	\N	0	daily	2025-10-25 09:01:07.368
68	2025-10-24 21:00:00	82	IN_STORE	\N	0	daily	2025-10-25 09:01:07.369
69	2025-10-24 21:00:00	85	IN_STORE	\N	0	daily	2025-10-25 09:01:07.37
70	2025-10-24 21:00:00	86	IN_STORE	\N	0	daily	2025-10-25 09:01:07.371
71	2025-10-24 21:00:00	87	IN_STORE	\N	0	daily	2025-10-25 09:01:07.372
72	2025-10-24 21:00:00	88	IN_STORE	\N	0	daily	2025-10-25 09:01:07.372
856	2025-11-01 21:00:00	\N	IN_STORE	27.49	27.49	daily	2025-11-02 12:12:19.381
857	2025-11-01 21:00:00	\N	IN_STORE	3.06	12.24	daily	2025-11-02 12:12:19.385
858	2025-11-01 21:00:00	\N	IN_STORE	3.27	9.81	daily	2025-11-02 12:12:19.387
859	2025-11-01 21:00:00	\N	IN_STORE	1.74	3.48	daily	2025-11-02 12:12:19.389
860	2025-11-01 21:00:00	\N	IN_STORE	2.22	11.1	daily	2025-11-02 12:12:19.391
861	2025-11-01 21:00:00	\N	IN_STORE	21.54	21.54	daily	2025-11-02 12:12:19.393
862	2025-11-01 21:00:00	\N	IN_STORE	2.4	4.8	daily	2025-11-02 12:12:19.394
863	2025-11-01 21:00:00	\N	IN_STORE	3.22	3.22	daily	2025-11-02 12:12:19.396
864	2025-11-01 21:00:00	\N	IN_STORE	6.96	13.92	daily	2025-11-02 12:12:19.398
865	2025-11-01 21:00:00	\N	IN_STORE	23.04	23.04	daily	2025-11-02 12:12:19.399
866	2025-11-01 21:00:00	\N	IN_STORE	11.88	11.88	daily	2025-11-02 12:12:19.401
867	2025-11-01 21:00:00	\N	IN_STORE	2.16	17.28	daily	2025-11-02 12:12:19.403
868	2025-11-01 21:00:00	\N	IN_STORE	5.82	23.28	daily	2025-11-02 12:12:19.405
869	2025-11-01 21:00:00	\N	IN_STORE	3.22	3.22	daily	2025-11-02 12:12:19.406
870	2025-11-01 21:00:00	\N	IN_STORE	1	3	daily	2025-11-02 12:12:19.408
871	2025-11-01 21:00:00	\N	IN_STORE	2.16	8.64	daily	2025-11-02 12:12:19.409
872	2025-11-01 21:00:00	\N	IN_STORE	2.16	12.96	daily	2025-11-02 12:12:19.411
873	2025-11-01 21:00:00	\N	IN_STORE	5.52	22.08	daily	2025-11-02 12:12:19.412
874	2025-11-01 21:00:00	\N	IN_STORE	16.2	16.2	daily	2025-11-02 12:12:19.414
875	2025-11-01 21:00:00	\N	IN_STORE	2.4	9.6	daily	2025-11-02 12:12:19.416
876	2025-11-01 21:00:00	\N	IN_STORE	35.46	35.46	daily	2025-11-02 12:12:19.417
877	2025-11-01 21:00:00	\N	IN_STORE	19.5	39	daily	2025-11-02 12:12:19.418
878	2025-11-01 21:00:00	\N	IN_STORE	12.42	49.68	daily	2025-11-02 12:12:19.42
879	2025-11-01 21:00:00	\N	IN_STORE	2.88	8.64	daily	2025-11-02 12:12:19.421
880	2025-11-01 21:00:00	\N	IN_STORE	12	48	daily	2025-11-02 12:12:19.423
881	2025-11-01 21:00:00	\N	IN_STORE	105	105	daily	2025-11-02 12:12:19.424
882	2025-11-01 21:00:00	\N	IN_STORE	5.100000000000001	51.00000000000001	daily	2025-11-02 12:12:19.426
883	2025-11-01 21:00:00	\N	IN_STORE	5.61	33.66	daily	2025-11-02 12:12:19.427
884	2025-11-01 21:00:00	\N	IN_STORE	11.63	23.26	daily	2025-11-02 12:12:19.429
885	2025-11-01 21:00:00	\N	IN_STORE	7.08	28.32	daily	2025-11-02 12:12:19.43
886	2025-11-01 21:00:00	\N	IN_STORE	2.64	26.4	daily	2025-11-02 12:12:19.432
887	2025-11-01 21:00:00	\N	IN_STORE	1.08	2.16	daily	2025-11-02 12:12:19.434
888	2025-11-01 21:00:00	\N	IN_STORE	1.41	1.41	daily	2025-11-02 12:12:19.436
889	2025-11-01 21:00:00	\N	IN_STORE	6.93	13.86	daily	2025-11-02 12:12:19.437
890	2025-11-01 21:00:00	\N	IN_STORE	5.52	11.04	daily	2025-11-02 12:12:19.438
891	2025-11-01 21:00:00	\N	IN_STORE	2.25	4.5	daily	2025-11-02 12:12:19.439
892	2025-11-01 21:00:00	\N	IN_STORE	3.37	13.48	daily	2025-11-02 12:12:19.441
893	2025-11-01 21:00:00	\N	IN_STORE	2	10	daily	2025-11-02 12:12:19.442
894	2025-11-01 21:00:00	\N	IN_STORE	3.37	13.48	daily	2025-11-02 12:12:19.443
895	2025-11-01 21:00:00	\N	IN_STORE	3.12	9.36	daily	2025-11-02 12:12:19.445
896	2025-11-01 21:00:00	\N	IN_STORE	6.45	6.45	daily	2025-11-02 12:12:19.446
897	2025-11-01 21:00:00	\N	IN_STORE	1.6	9.6	daily	2025-11-02 12:12:19.448
898	2025-11-01 21:00:00	\N	IN_STORE	12.12	24.24	daily	2025-11-02 12:12:19.451
899	2025-11-01 21:00:00	\N	IN_STORE	5.94	5.94	daily	2025-11-02 12:12:19.462
900	2025-11-01 21:00:00	\N	IN_STORE	14.58	14.58	daily	2025-11-02 12:12:19.464
901	2025-11-01 21:00:00	\N	IN_STORE	2.7	18.9	daily	2025-11-02 12:12:19.465
902	2025-11-01 21:00:00	\N	IN_STORE	4.5	4.5	daily	2025-11-02 12:12:19.467
903	2025-11-01 21:00:00	\N	IN_STORE	58.44	58.44	daily	2025-11-02 12:12:19.469
904	2025-11-01 21:00:00	\N	IN_STORE	98.82	98.82	daily	2025-11-02 12:12:19.47
905	2025-11-01 21:00:00	\N	IN_STORE	84.54	84.54	daily	2025-11-02 12:12:19.471
906	2025-11-01 21:00:00	\N	IN_STORE	66.75	66.75	daily	2025-11-02 12:12:19.473
907	2025-11-01 21:00:00	\N	IN_STORE	27.73	27.73	daily	2025-11-02 12:12:19.474
908	2025-11-01 21:00:00	\N	IN_STORE	13.8	27.6	daily	2025-11-02 12:12:19.475
909	2025-11-01 21:00:00	\N	IN_STORE	30.44	30.44	daily	2025-11-02 12:12:19.477
910	2025-11-01 21:00:00	\N	IN_STORE	43	43	daily	2025-11-02 12:12:19.478
911	2025-11-01 21:00:00	\N	IN_STORE	4.68	9.36	daily	2025-11-02 12:12:19.481
912	2025-11-01 21:00:00	\N	IN_STORE	18.18	18.18	daily	2025-11-02 12:12:19.489
913	2025-11-01 21:00:00	\N	IN_STORE	3.54	10.62	daily	2025-11-02 12:12:19.497
914	2025-11-01 21:00:00	\N	IN_STORE	6.72	13.44	daily	2025-11-02 12:12:19.504
915	2025-11-01 21:00:00	\N	IN_STORE	2	40	daily	2025-11-02 12:12:19.506
916	2025-11-01 21:00:00	\N	IN_STORE	21.6	21.6	daily	2025-11-02 12:12:19.508
917	2025-11-01 21:00:00	\N	IN_STORE	18.12	54.36	daily	2025-11-02 12:12:19.509
918	2025-11-01 21:00:00	\N	IN_STORE	6.51	6.51	daily	2025-11-02 12:12:19.511
919	2025-11-01 21:00:00	\N	IN_STORE	5.16	5.16	daily	2025-11-02 12:12:19.512
920	2025-11-01 21:00:00	\N	IN_STORE	6.48	12.96	daily	2025-11-02 12:12:19.514
921	2025-11-01 21:00:00	\N	IN_STORE	5.25	5.25	daily	2025-11-02 12:12:19.515
922	2025-11-01 21:00:00	\N	IN_STORE	4.29	4.29	daily	2025-11-02 12:12:19.517
923	2025-11-01 21:00:00	\N	IN_STORE	4.74	4.74	daily	2025-11-02 12:12:19.518
924	2025-11-01 21:00:00	\N	IN_STORE	1.38	12.42	daily	2025-11-02 12:12:19.52
925	2025-11-01 21:00:00	\N	IN_STORE	1.74	8.7	daily	2025-11-02 12:12:19.521
926	2025-11-01 21:00:00	\N	IN_STORE	1.08	2.16	daily	2025-11-02 12:12:19.522
927	2025-11-01 21:00:00	\N	IN_STORE	1.74	1.74	daily	2025-11-02 12:12:19.524
928	2025-11-01 21:00:00	\N	IN_STORE	0.9200000000000002	4.600000000000001	daily	2025-11-02 12:12:19.525
929	2025-11-01 21:00:00	\N	IN_STORE	6.96	13.92	daily	2025-11-02 12:12:19.527
930	2025-11-01 21:00:00	\N	IN_STORE	1.08	3.24	daily	2025-11-02 12:12:19.528
931	2025-11-01 21:00:00	\N	IN_STORE	33.12	66.24	daily	2025-11-02 12:12:19.529
932	2025-11-01 21:00:00	\N	IN_STORE	8.7	8.7	daily	2025-11-02 12:12:19.531
933	2025-11-01 21:00:00	\N	IN_STORE	11.7	11.7	daily	2025-11-02 12:12:19.532
934	2025-11-01 21:00:00	\N	IN_STORE	11.7	23.4	daily	2025-11-02 12:12:19.533
935	2025-11-01 21:00:00	\N	IN_STORE	6.75	6.75	daily	2025-11-02 12:12:19.534
936	2025-11-01 21:00:00	\N	IN_STORE	15.36	15.36	daily	2025-11-02 12:12:19.554
937	2025-11-01 21:00:00	\N	IN_STORE	22.95	45.9	daily	2025-11-02 12:12:19.562
938	2025-11-01 21:00:00	\N	IN_STORE	84	84	daily	2025-11-02 12:12:19.57
939	2025-11-01 21:00:00	\N	IN_STORE	3.54	14.16	daily	2025-11-02 12:12:19.584
940	2025-11-01 21:00:00	\N	IN_STORE	14.04	14.04	daily	2025-11-02 12:12:19.592
941	2025-11-01 21:00:00	10	IN_STORE	\N	0	daily	2025-11-02 12:12:19.601
942	2025-11-01 21:00:00	11	IN_STORE	\N	0	daily	2025-11-02 12:12:19.602
943	2025-11-01 21:00:00	6	IN_STORE	\N	0	daily	2025-11-02 12:12:19.603
944	2025-11-01 21:00:00	12	IN_STORE	\N	0	daily	2025-11-02 12:12:19.604
945	2025-11-01 21:00:00	19	IN_STORE	\N	0	daily	2025-11-02 12:12:19.605
946	2025-11-01 21:00:00	13	IN_STORE	\N	0	daily	2025-11-02 12:12:19.606
947	2025-11-01 21:00:00	18	IN_STORE	\N	0	daily	2025-11-02 12:12:19.606
948	2025-11-01 21:00:00	23	IN_STORE	\N	0	daily	2025-11-02 12:12:19.607
949	2025-11-01 21:00:00	24	IN_STORE	\N	0	daily	2025-11-02 12:12:19.608
950	2025-11-01 21:00:00	25	IN_STORE	\N	0	daily	2025-11-02 12:12:19.608
951	2025-11-01 21:00:00	28	IN_STORE	\N	0	daily	2025-11-02 12:12:19.609
952	2025-11-01 21:00:00	29	IN_STORE	\N	0	daily	2025-11-02 12:12:19.609
953	2025-11-01 21:00:00	30	IN_STORE	\N	0	daily	2025-11-02 12:12:19.61
954	2025-11-01 21:00:00	46	IN_STORE	\N	0	daily	2025-11-02 12:12:19.611
955	2025-11-01 21:00:00	31	IN_STORE	\N	0	daily	2025-11-02 12:12:19.611
956	2025-11-01 21:00:00	32	IN_STORE	\N	0	daily	2025-11-02 12:12:19.612
957	2025-11-01 21:00:00	33	IN_STORE	\N	0	daily	2025-11-02 12:12:19.613
958	2025-11-01 21:00:00	39	IN_STORE	\N	0	daily	2025-11-02 12:12:19.613
959	2025-11-01 21:00:00	41	IN_STORE	\N	0	daily	2025-11-02 12:12:19.614
960	2025-11-01 21:00:00	44	IN_STORE	\N	0	daily	2025-11-02 12:12:19.614
961	2025-11-01 21:00:00	40	IN_STORE	\N	0	daily	2025-11-02 12:12:19.615
962	2025-11-01 21:00:00	48	IN_STORE	\N	0	daily	2025-11-02 12:12:19.616
963	2025-11-01 21:00:00	43	IN_STORE	\N	0	daily	2025-11-02 12:12:19.616
964	2025-11-01 21:00:00	54	IN_STORE	\N	0	daily	2025-11-02 12:12:19.617
965	2025-11-01 21:00:00	53	IN_STORE	\N	0	daily	2025-11-02 12:12:19.618
966	2025-11-01 21:00:00	52	IN_STORE	\N	0	daily	2025-11-02 12:12:19.618
967	2025-11-01 21:00:00	64	IN_STORE	\N	0	daily	2025-11-02 12:12:19.619
968	2025-11-01 21:00:00	59	IN_STORE	\N	0	daily	2025-11-02 12:12:19.619
969	2025-11-01 21:00:00	58	IN_STORE	\N	0	daily	2025-11-02 12:12:19.62
970	2025-11-01 21:00:00	63	IN_STORE	\N	0	daily	2025-11-02 12:12:19.62
971	2025-11-01 21:00:00	57	IN_STORE	\N	0	daily	2025-11-02 12:12:19.621
972	2025-11-01 21:00:00	56	IN_STORE	\N	0	daily	2025-11-02 12:12:19.622
973	2025-11-01 21:00:00	55	IN_STORE	\N	0	daily	2025-11-02 12:12:19.622
974	2025-11-01 21:00:00	62	IN_STORE	\N	0	daily	2025-11-02 12:12:19.623
975	2025-11-01 21:00:00	65	IN_STORE	\N	0	daily	2025-11-02 12:12:19.623
976	2025-11-01 21:00:00	66	IN_STORE	\N	0	daily	2025-11-02 12:12:19.624
977	2025-11-01 21:00:00	380	IN_STORE	\N	0	daily	2025-11-02 12:12:19.624
978	2025-11-01 21:00:00	73	IN_STORE	\N	0	daily	2025-11-02 12:12:19.625
979	2025-11-01 21:00:00	74	IN_STORE	\N	0	daily	2025-11-02 12:12:19.626
980	2025-11-01 21:00:00	75	IN_STORE	\N	0	daily	2025-11-02 12:12:19.626
981	2025-11-01 21:00:00	76	IN_STORE	\N	0	daily	2025-11-02 12:12:19.627
982	2025-11-01 21:00:00	79	IN_STORE	\N	0	daily	2025-11-02 12:12:19.627
983	2025-11-01 21:00:00	80	IN_STORE	\N	0	daily	2025-11-02 12:12:19.628
984	2025-11-01 21:00:00	81	IN_STORE	\N	0	daily	2025-11-02 12:12:19.629
985	2025-11-01 21:00:00	71	IN_STORE	\N	0	daily	2025-11-02 12:12:19.629
986	2025-11-01 21:00:00	72	IN_STORE	\N	0	daily	2025-11-02 12:12:19.63
987	2025-11-01 21:00:00	82	IN_STORE	\N	0	daily	2025-11-02 12:12:19.63
988	2025-11-01 21:00:00	85	IN_STORE	\N	0	daily	2025-11-02 12:12:19.631
989	2025-11-01 21:00:00	86	IN_STORE	\N	0	daily	2025-11-02 12:12:19.632
990	2025-11-01 21:00:00	87	IN_STORE	\N	0	daily	2025-11-02 12:12:19.632
991	2025-11-01 21:00:00	94	IN_STORE	\N	0	daily	2025-11-02 12:12:19.633
992	2025-11-01 21:00:00	95	IN_STORE	\N	0	daily	2025-11-02 12:12:19.633
993	2025-11-01 21:00:00	105	IN_STORE	\N	0	daily	2025-11-02 12:12:19.634
994	2025-11-01 21:00:00	97	IN_STORE	\N	0	daily	2025-11-02 12:12:19.634
995	2025-11-01 21:00:00	98	IN_STORE	\N	0	daily	2025-11-02 12:12:19.635
996	2025-11-01 21:00:00	103	IN_STORE	\N	0	daily	2025-11-02 12:12:19.636
997	2025-11-01 21:00:00	104	IN_STORE	\N	0	daily	2025-11-02 12:12:19.636
998	2025-11-01 21:00:00	106	IN_STORE	\N	0	daily	2025-11-02 12:12:19.637
999	2025-11-01 21:00:00	99	IN_STORE	\N	0	daily	2025-11-02 12:12:19.637
1000	2025-11-01 21:00:00	124	IN_STORE	\N	0	daily	2025-11-02 12:12:19.638
1001	2025-11-01 21:00:00	125	IN_STORE	\N	0	daily	2025-11-02 12:12:19.639
1002	2025-11-01 21:00:00	114	IN_STORE	\N	0	daily	2025-11-02 12:12:19.639
1003	2025-11-01 21:00:00	123	IN_STORE	\N	0	daily	2025-11-02 12:12:19.64
1004	2025-11-01 21:00:00	133	IN_STORE	\N	0	daily	2025-11-02 12:12:19.64
1005	2025-11-01 21:00:00	131	IN_STORE	\N	0	daily	2025-11-02 12:12:19.641
1006	2025-11-01 21:00:00	130	IN_STORE	\N	0	daily	2025-11-02 12:12:19.642
1007	2025-11-01 21:00:00	148	IN_STORE	\N	0	daily	2025-11-02 12:12:19.642
1008	2025-11-01 21:00:00	149	IN_STORE	\N	0	daily	2025-11-02 12:12:19.643
1009	2025-11-01 21:00:00	150	IN_STORE	\N	0	daily	2025-11-02 12:12:19.643
1010	2025-11-01 21:00:00	151	IN_STORE	\N	0	daily	2025-11-02 12:12:19.644
1011	2025-11-01 21:00:00	152	IN_STORE	\N	0	daily	2025-11-02 12:12:19.644
1012	2025-11-01 21:00:00	165	IN_STORE	\N	0	daily	2025-11-02 12:12:19.645
637	2025-10-28 21:00:00	\N	IN_STORE	27.49	54.98	daily	2025-10-29 12:24:46.034
638	2025-10-28 21:00:00	\N	IN_STORE	3.06	12.24	daily	2025-10-29 12:24:46.036
639	2025-10-28 21:00:00	\N	IN_STORE	3.27	9.81	daily	2025-10-29 12:24:46.037
640	2025-10-28 21:00:00	\N	IN_STORE	1.74	3.48	daily	2025-10-29 12:24:46.039
641	2025-10-28 21:00:00	\N	IN_STORE	2.22	11.1	daily	2025-10-29 12:24:46.04
642	2025-10-28 21:00:00	\N	IN_STORE	21.54	21.54	daily	2025-10-29 12:24:46.042
643	2025-10-28 21:00:00	\N	IN_STORE	2.4	4.8	daily	2025-10-29 12:24:46.043
644	2025-10-28 21:00:00	\N	IN_STORE	3.22	3.22	daily	2025-10-29 12:24:46.044
645	2025-10-28 21:00:00	\N	IN_STORE	6.96	13.92	daily	2025-10-29 12:24:46.045
646	2025-10-28 21:00:00	\N	IN_STORE	23.04	23.04	daily	2025-10-29 12:24:46.047
647	2025-10-28 21:00:00	\N	IN_STORE	11.88	11.88	daily	2025-10-29 12:24:46.048
648	2025-10-28 21:00:00	\N	IN_STORE	2.16	17.28	daily	2025-10-29 12:24:46.049
649	2025-10-28 21:00:00	\N	IN_STORE	5.82	23.28	daily	2025-10-29 12:24:46.05
650	2025-10-28 21:00:00	\N	IN_STORE	3.22	3.22	daily	2025-10-29 12:24:46.052
651	2025-10-28 21:00:00	\N	IN_STORE	1	3	daily	2025-10-29 12:24:46.053
652	2025-10-28 21:00:00	\N	IN_STORE	2.16	8.64	daily	2025-10-29 12:24:46.054
653	2025-10-28 21:00:00	\N	IN_STORE	2.16	12.96	daily	2025-10-29 12:24:46.056
654	2025-10-28 21:00:00	\N	IN_STORE	5.52	11.04	daily	2025-10-29 12:24:46.057
655	2025-10-28 21:00:00	\N	IN_STORE	16.2	16.2	daily	2025-10-29 12:24:46.058
656	2025-10-28 21:00:00	\N	IN_STORE	2.4	9.6	daily	2025-10-29 12:24:46.062
657	2025-10-28 21:00:00	\N	IN_STORE	12.42	24.84	daily	2025-10-29 12:24:46.064
658	2025-10-28 21:00:00	\N	IN_STORE	2.88	8.64	daily	2025-10-29 12:24:46.067
659	2025-10-28 21:00:00	\N	IN_STORE	12	72	daily	2025-10-29 12:24:46.068
660	2025-10-28 21:00:00	\N	IN_STORE	5.61	33.66	daily	2025-10-29 12:24:46.069
661	2025-10-28 21:00:00	\N	IN_STORE	5.16	5.16	daily	2025-10-29 12:24:46.071
662	2025-10-28 21:00:00	\N	IN_STORE	7.08	28.32	daily	2025-10-29 12:24:46.072
663	2025-10-28 21:00:00	\N	IN_STORE	1.08	2.16	daily	2025-10-29 12:24:46.074
664	2025-10-28 21:00:00	\N	IN_STORE	1.41	1.41	daily	2025-10-29 12:24:46.075
665	2025-10-28 21:00:00	\N	IN_STORE	6.93	13.86	daily	2025-10-29 12:24:46.077
666	2025-10-28 21:00:00	\N	IN_STORE	5.52	11.04	daily	2025-10-29 12:24:46.078
667	2025-10-28 21:00:00	\N	IN_STORE	2.25	4.5	daily	2025-10-29 12:24:46.079
668	2025-10-28 21:00:00	\N	IN_STORE	2	10	daily	2025-10-29 12:24:46.08
669	2025-10-28 21:00:00	\N	IN_STORE	3.12	9.36	daily	2025-10-29 12:24:46.082
670	2025-10-28 21:00:00	\N	IN_STORE	6.45	6.45	daily	2025-10-29 12:24:46.083
671	2025-10-28 21:00:00	\N	IN_STORE	1.6	9.6	daily	2025-10-29 12:24:46.084
672	2025-10-28 21:00:00	\N	IN_STORE	12.12	24.24	daily	2025-10-29 12:24:46.085
673	2025-10-28 21:00:00	\N	IN_STORE	5.94	5.94	daily	2025-10-29 12:24:46.086
674	2025-10-28 21:00:00	\N	IN_STORE	14.58	14.58	daily	2025-10-29 12:24:46.088
675	2025-10-28 21:00:00	\N	IN_STORE	2.7	18.9	daily	2025-10-29 12:24:46.089
676	2025-10-28 21:00:00	\N	IN_STORE	4.5	4.5	daily	2025-10-29 12:24:46.09
677	2025-10-28 21:00:00	\N	IN_STORE	98.82	98.82	daily	2025-10-29 12:24:46.092
678	2025-10-28 21:00:00	\N	IN_STORE	84.54	84.54	daily	2025-10-29 12:24:46.093
679	2025-10-28 21:00:00	\N	IN_STORE	66.75	66.75	daily	2025-10-29 12:24:46.094
680	2025-10-28 21:00:00	\N	IN_STORE	27.73	27.73	daily	2025-10-29 12:24:46.095
681	2025-10-28 21:00:00	\N	IN_STORE	13.8	27.6	daily	2025-10-29 12:24:46.097
682	2025-10-28 21:00:00	\N	IN_STORE	30.44	30.44	daily	2025-10-29 12:24:46.098
683	2025-10-28 21:00:00	\N	IN_STORE	43	43	daily	2025-10-29 12:24:46.099
684	2025-10-28 21:00:00	\N	IN_STORE	18.18	18.18	daily	2025-10-29 12:24:46.101
685	2025-10-28 21:00:00	\N	IN_STORE	3.54	10.62	daily	2025-10-29 12:24:46.102
686	2025-10-28 21:00:00	\N	IN_STORE	6.72	13.44	daily	2025-10-29 12:24:46.103
687	2025-10-28 21:00:00	\N	IN_STORE	2	40	daily	2025-10-29 12:24:46.104
688	2025-10-28 21:00:00	\N	IN_STORE	21.6	21.6	daily	2025-10-29 12:24:46.106
689	2025-10-28 21:00:00	\N	IN_STORE	18.12	54.36	daily	2025-10-29 12:24:46.107
690	2025-10-28 21:00:00	\N	IN_STORE	6.51	6.51	daily	2025-10-29 12:24:46.108
691	2025-10-28 21:00:00	\N	IN_STORE	5.16	5.16	daily	2025-10-29 12:24:46.109
692	2025-10-28 21:00:00	\N	IN_STORE	6.48	12.96	daily	2025-10-29 12:24:46.111
693	2025-10-28 21:00:00	\N	IN_STORE	5.25	5.25	daily	2025-10-29 12:24:46.112
694	2025-10-28 21:00:00	\N	IN_STORE	4.29	4.29	daily	2025-10-29 12:24:46.113
695	2025-10-28 21:00:00	\N	IN_STORE	4.74	4.74	daily	2025-10-29 12:24:46.114
696	2025-10-28 21:00:00	10	IN_STORE	\N	0	daily	2025-10-29 12:24:46.12
697	2025-10-28 21:00:00	7	IN_STORE	\N	0	daily	2025-10-29 12:24:46.121
698	2025-10-28 21:00:00	11	IN_STORE	\N	0	daily	2025-10-29 12:24:46.122
699	2025-10-28 21:00:00	6	IN_STORE	\N	0	daily	2025-10-29 12:24:46.122
700	2025-10-28 21:00:00	12	IN_STORE	\N	0	daily	2025-10-29 12:24:46.123
701	2025-10-28 21:00:00	19	IN_STORE	\N	0	daily	2025-10-29 12:24:46.123
702	2025-10-28 21:00:00	13	IN_STORE	\N	0	daily	2025-10-29 12:24:46.124
703	2025-10-28 21:00:00	18	IN_STORE	\N	0	daily	2025-10-29 12:24:46.125
704	2025-10-28 21:00:00	23	IN_STORE	\N	0	daily	2025-10-29 12:24:46.125
705	2025-10-28 21:00:00	24	IN_STORE	\N	0	daily	2025-10-29 12:24:46.126
706	2025-10-28 21:00:00	25	IN_STORE	\N	0	daily	2025-10-29 12:24:46.126
707	2025-10-28 21:00:00	28	IN_STORE	\N	0	daily	2025-10-29 12:24:46.127
708	2025-10-28 21:00:00	29	IN_STORE	\N	0	daily	2025-10-29 12:24:46.127
709	2025-10-28 21:00:00	30	IN_STORE	\N	0	daily	2025-10-29 12:24:46.128
710	2025-10-28 21:00:00	46	IN_STORE	\N	0	daily	2025-10-29 12:24:46.128
711	2025-10-28 21:00:00	31	IN_STORE	\N	0	daily	2025-10-29 12:24:46.129
712	2025-10-28 21:00:00	32	IN_STORE	\N	0	daily	2025-10-29 12:24:46.129
713	2025-10-28 21:00:00	33	IN_STORE	\N	0	daily	2025-10-29 12:24:46.13
714	2025-10-28 21:00:00	39	IN_STORE	\N	0	daily	2025-10-29 12:24:46.13
715	2025-10-28 21:00:00	41	IN_STORE	\N	0	daily	2025-10-29 12:24:46.131
716	2025-10-28 21:00:00	44	IN_STORE	\N	0	daily	2025-10-29 12:24:46.131
717	2025-10-28 21:00:00	40	IN_STORE	\N	0	daily	2025-10-29 12:24:46.132
718	2025-10-28 21:00:00	48	IN_STORE	\N	0	daily	2025-10-29 12:24:46.132
719	2025-10-28 21:00:00	43	IN_STORE	\N	0	daily	2025-10-29 12:24:46.133
720	2025-10-28 21:00:00	54	IN_STORE	\N	0	daily	2025-10-29 12:24:46.134
721	2025-10-28 21:00:00	53	IN_STORE	\N	0	daily	2025-10-29 12:24:46.134
722	2025-10-28 21:00:00	52	IN_STORE	\N	0	daily	2025-10-29 12:24:46.135
723	2025-10-28 21:00:00	64	IN_STORE	\N	0	daily	2025-10-29 12:24:46.135
724	2025-10-28 21:00:00	59	IN_STORE	\N	0	daily	2025-10-29 12:24:46.136
725	2025-10-28 21:00:00	58	IN_STORE	\N	0	daily	2025-10-29 12:24:46.136
726	2025-10-28 21:00:00	63	IN_STORE	\N	0	daily	2025-10-29 12:24:46.137
727	2025-10-28 21:00:00	57	IN_STORE	\N	0	daily	2025-10-29 12:24:46.137
728	2025-10-28 21:00:00	56	IN_STORE	\N	0	daily	2025-10-29 12:24:46.138
729	2025-10-28 21:00:00	55	IN_STORE	\N	0	daily	2025-10-29 12:24:46.138
730	2025-10-28 21:00:00	62	IN_STORE	\N	0	daily	2025-10-29 12:24:46.139
731	2025-10-28 21:00:00	65	IN_STORE	\N	0	daily	2025-10-29 12:24:46.142
732	2025-10-28 21:00:00	66	IN_STORE	\N	0	daily	2025-10-29 12:24:46.143
733	2025-10-28 21:00:00	380	IN_STORE	\N	0	daily	2025-10-29 12:24:46.143
734	2025-10-28 21:00:00	73	IN_STORE	\N	0	daily	2025-10-29 12:24:46.144
735	2025-10-28 21:00:00	74	IN_STORE	\N	0	daily	2025-10-29 12:24:46.144
736	2025-10-28 21:00:00	75	IN_STORE	\N	0	daily	2025-10-29 12:24:46.145
737	2025-10-28 21:00:00	76	IN_STORE	\N	0	daily	2025-10-29 12:24:46.145
738	2025-10-28 21:00:00	79	IN_STORE	\N	0	daily	2025-10-29 12:24:46.146
739	2025-10-28 21:00:00	80	IN_STORE	\N	0	daily	2025-10-29 12:24:46.147
740	2025-10-28 21:00:00	81	IN_STORE	\N	0	daily	2025-10-29 12:24:46.147
741	2025-10-28 21:00:00	71	IN_STORE	\N	0	daily	2025-10-29 12:24:46.148
742	2025-10-28 21:00:00	72	IN_STORE	\N	0	daily	2025-10-29 12:24:46.148
743	2025-10-28 21:00:00	82	IN_STORE	\N	0	daily	2025-10-29 12:24:46.149
744	2025-10-28 21:00:00	85	IN_STORE	\N	0	daily	2025-10-29 12:24:46.149
745	2025-10-28 21:00:00	86	IN_STORE	\N	0	daily	2025-10-29 12:24:46.15
746	2025-10-28 21:00:00	87	IN_STORE	\N	0	daily	2025-10-29 12:24:46.15
747	2025-10-28 21:00:00	94	IN_STORE	\N	0	daily	2025-10-29 12:24:46.151
748	2025-10-28 21:00:00	95	IN_STORE	\N	0	daily	2025-10-29 12:24:46.151
749	2025-10-28 21:00:00	105	IN_STORE	\N	0	daily	2025-10-29 12:24:46.152
750	2025-10-28 21:00:00	103	IN_STORE	\N	0	daily	2025-10-29 12:24:46.152
751	2025-10-28 21:00:00	104	IN_STORE	\N	0	daily	2025-10-29 12:24:46.153
752	2025-10-28 21:00:00	106	IN_STORE	\N	0	daily	2025-10-29 12:24:46.153
753	2025-10-28 21:00:00	99	IN_STORE	\N	0	daily	2025-10-29 12:24:46.154
1013	2025-11-01 21:00:00	162	IN_STORE	\N	0	daily	2025-11-02 12:12:19.646
1014	2025-11-01 21:00:00	160	IN_STORE	\N	0	daily	2025-11-02 12:12:19.646
1015	2025-11-01 21:00:00	163	IN_STORE	\N	0	daily	2025-11-02 12:12:19.647
1016	2025-11-01 21:00:00	161	IN_STORE	\N	0	daily	2025-11-02 12:12:19.648
1017	2025-11-01 21:00:00	164	IN_STORE	\N	0	daily	2025-11-02 12:12:19.648
1018	2025-11-01 21:00:00	156	IN_STORE	\N	0	daily	2025-11-02 12:12:19.649
1019	2025-11-01 21:00:00	155	IN_STORE	\N	0	daily	2025-11-02 12:12:19.649
1020	2025-11-01 21:00:00	154	IN_STORE	\N	0	daily	2025-11-02 12:12:19.65
1021	2025-11-01 21:00:00	175	IN_STORE	\N	0	daily	2025-11-02 12:12:19.65
1022	2025-11-01 21:00:00	176	IN_STORE	\N	0	daily	2025-11-02 12:12:19.651
1023	2025-11-01 21:00:00	181	IN_STORE	\N	0	daily	2025-11-02 12:12:19.652
1024	2025-11-01 21:00:00	182	IN_STORE	\N	0	daily	2025-11-02 12:12:19.652
1025	2025-11-01 21:00:00	183	IN_STORE	\N	0	daily	2025-11-02 12:12:19.653
1026	2025-11-01 21:00:00	184	IN_STORE	\N	0	daily	2025-11-02 12:12:19.654
1027	2025-11-01 21:00:00	195	IN_STORE	\N	0	daily	2025-11-02 12:12:19.654
1028	2025-11-01 21:00:00	196	IN_STORE	\N	0	daily	2025-11-02 12:12:19.655
1029	2025-11-01 21:00:00	197	IN_STORE	\N	0	daily	2025-11-02 12:12:19.655
1030	2025-11-01 21:00:00	198	IN_STORE	\N	0	daily	2025-11-02 12:12:19.656
1031	2025-11-01 21:00:00	199	IN_STORE	\N	0	daily	2025-11-02 12:12:19.657
1032	2025-11-01 21:00:00	200	IN_STORE	\N	0	daily	2025-11-02 12:12:19.657
1033	2025-11-01 21:00:00	207	IN_STORE	\N	0	daily	2025-11-02 12:12:19.658
1034	2025-11-01 21:00:00	208	IN_STORE	\N	0	daily	2025-11-02 12:12:19.658
1035	2025-11-01 21:00:00	203	IN_STORE	\N	0	daily	2025-11-02 12:12:19.659
1036	2025-11-01 21:00:00	213	IN_STORE	\N	0	daily	2025-11-02 12:12:19.659
1037	2025-11-01 21:00:00	215	IN_STORE	\N	0	daily	2025-11-02 12:12:19.66
1038	2025-11-01 21:00:00	212	IN_STORE	\N	0	daily	2025-11-02 12:12:19.661
1039	2025-11-01 21:00:00	216	IN_STORE	\N	0	daily	2025-11-02 12:12:19.661
1040	2025-11-01 21:00:00	219	IN_STORE	\N	0	daily	2025-11-02 12:12:19.662
1041	2025-11-01 21:00:00	218	IN_STORE	\N	0	daily	2025-11-02 12:12:19.662
1042	2025-11-01 21:00:00	223	IN_STORE	\N	0	daily	2025-11-02 12:12:19.663
1043	2025-11-01 21:00:00	224	IN_STORE	\N	0	daily	2025-11-02 12:12:19.664
1044	2025-11-01 21:00:00	238	IN_STORE	\N	0	daily	2025-11-02 12:12:19.664
1045	2025-11-01 21:00:00	236	IN_STORE	\N	0	daily	2025-11-02 12:12:19.665
1046	2025-11-01 21:00:00	239	IN_STORE	\N	0	daily	2025-11-02 12:12:19.665
1047	2025-11-01 21:00:00	237	IN_STORE	\N	0	daily	2025-11-02 12:12:19.666
1048	2025-11-01 21:00:00	235	IN_STORE	\N	0	daily	2025-11-02 12:12:19.667
1049	2025-11-01 21:00:00	249	IN_STORE	\N	0	daily	2025-11-02 12:12:19.667
1050	2025-11-01 21:00:00	227	IN_STORE	\N	0	daily	2025-11-02 12:12:19.668
1051	2025-11-01 21:00:00	228	IN_STORE	\N	0	daily	2025-11-02 12:12:19.668
1052	2025-11-01 21:00:00	230	IN_STORE	\N	0	daily	2025-11-02 12:12:19.669
1053	2025-11-01 21:00:00	231	IN_STORE	\N	0	daily	2025-11-02 12:12:19.669
1054	2025-11-01 21:00:00	242	IN_STORE	\N	0	daily	2025-11-02 12:12:19.67
1055	2025-11-01 21:00:00	243	IN_STORE	\N	0	daily	2025-11-02 12:12:19.67
1056	2025-11-01 21:00:00	244	IN_STORE	\N	0	daily	2025-11-02 12:12:19.671
1057	2025-11-01 21:00:00	245	IN_STORE	\N	0	daily	2025-11-02 12:12:19.672
1058	2025-11-01 21:00:00	248	IN_STORE	\N	0	daily	2025-11-02 12:12:19.672
1059	2025-11-01 21:00:00	250	IN_STORE	\N	0	daily	2025-11-02 12:12:19.673
1060	2025-11-01 21:00:00	253	IN_STORE	\N	0	daily	2025-11-02 12:12:19.673
1061	2025-11-01 21:00:00	259	IN_STORE	\N	0	daily	2025-11-02 12:12:19.674
1062	2025-11-01 21:00:00	261	IN_STORE	\N	0	daily	2025-11-02 12:12:19.674
1063	2025-11-01 21:00:00	260	IN_STORE	\N	0	daily	2025-11-02 12:12:19.675
1064	2025-11-01 21:00:00	264	IN_STORE	\N	0	daily	2025-11-02 12:12:19.676
1065	2025-11-01 21:00:00	262	IN_STORE	\N	0	daily	2025-11-02 12:12:19.676
1066	2025-11-01 21:00:00	263	IN_STORE	\N	0	daily	2025-11-02 12:12:19.677
1067	2025-11-01 21:00:00	275	IN_STORE	\N	0	daily	2025-11-02 12:12:19.677
1068	2025-11-01 21:00:00	274	IN_STORE	\N	0	daily	2025-11-02 12:12:19.678
1069	2025-11-01 21:00:00	268	IN_STORE	\N	0	daily	2025-11-02 12:12:19.678
1070	2025-11-01 21:00:00	282	IN_STORE	\N	0	daily	2025-11-02 12:12:19.679
1071	2025-11-01 21:00:00	270	IN_STORE	\N	0	daily	2025-11-02 12:12:19.68
1072	2025-11-01 21:00:00	286	IN_STORE	\N	0	daily	2025-11-02 12:12:19.68
1073	2025-11-01 21:00:00	283	IN_STORE	\N	0	daily	2025-11-02 12:12:19.681
1074	2025-11-01 21:00:00	277	IN_STORE	\N	0	daily	2025-11-02 12:12:19.682
1075	2025-11-01 21:00:00	284	IN_STORE	\N	0	daily	2025-11-02 12:12:19.682
1076	2025-11-01 21:00:00	287	IN_STORE	\N	0	daily	2025-11-02 12:12:19.683
1077	2025-11-01 21:00:00	281	IN_STORE	\N	0	daily	2025-11-02 12:12:19.684
754	2025-10-28 21:00:00	124	IN_STORE	\N	0	daily	2025-10-29 12:24:46.155
755	2025-10-28 21:00:00	125	IN_STORE	\N	0	daily	2025-10-29 12:24:46.155
756	2025-10-28 21:00:00	133	IN_STORE	\N	0	daily	2025-10-29 12:24:46.156
757	2025-10-28 21:00:00	131	IN_STORE	\N	0	daily	2025-10-29 12:24:46.156
758	2025-10-28 21:00:00	130	IN_STORE	\N	0	daily	2025-10-29 12:24:46.157
759	2025-10-28 21:00:00	165	IN_STORE	\N	0	daily	2025-10-29 12:24:46.157
760	2025-10-28 21:00:00	162	IN_STORE	\N	0	daily	2025-10-29 12:24:46.158
761	2025-10-28 21:00:00	160	IN_STORE	\N	0	daily	2025-10-29 12:24:46.158
762	2025-10-28 21:00:00	163	IN_STORE	\N	0	daily	2025-10-29 12:24:46.159
763	2025-10-28 21:00:00	161	IN_STORE	\N	0	daily	2025-10-29 12:24:46.16
764	2025-10-28 21:00:00	164	IN_STORE	\N	0	daily	2025-10-29 12:24:46.16
765	2025-10-28 21:00:00	170	IN_STORE	\N	0	daily	2025-10-29 12:24:46.161
766	2025-10-28 21:00:00	181	IN_STORE	\N	0	daily	2025-10-29 12:24:46.161
767	2025-10-28 21:00:00	182	IN_STORE	\N	0	daily	2025-10-29 12:24:46.162
768	2025-10-28 21:00:00	183	IN_STORE	\N	0	daily	2025-10-29 12:24:46.162
769	2025-10-28 21:00:00	184	IN_STORE	\N	0	daily	2025-10-29 12:24:46.163
770	2025-10-28 21:00:00	207	IN_STORE	\N	0	daily	2025-10-29 12:24:46.163
771	2025-10-28 21:00:00	208	IN_STORE	\N	0	daily	2025-10-29 12:24:46.164
772	2025-10-28 21:00:00	203	IN_STORE	\N	0	daily	2025-10-29 12:24:46.164
773	2025-10-28 21:00:00	213	IN_STORE	\N	0	daily	2025-10-29 12:24:46.165
774	2025-10-28 21:00:00	215	IN_STORE	\N	0	daily	2025-10-29 12:24:46.165
775	2025-10-28 21:00:00	212	IN_STORE	\N	0	daily	2025-10-29 12:24:46.166
776	2025-10-28 21:00:00	216	IN_STORE	\N	0	daily	2025-10-29 12:24:46.166
777	2025-10-28 21:00:00	223	IN_STORE	\N	0	daily	2025-10-29 12:24:46.167
778	2025-10-28 21:00:00	224	IN_STORE	\N	0	daily	2025-10-29 12:24:46.167
779	2025-10-28 21:00:00	238	IN_STORE	\N	0	daily	2025-10-29 12:24:46.168
780	2025-10-28 21:00:00	236	IN_STORE	\N	0	daily	2025-10-29 12:24:46.168
781	2025-10-28 21:00:00	239	IN_STORE	\N	0	daily	2025-10-29 12:24:46.169
782	2025-10-28 21:00:00	237	IN_STORE	\N	0	daily	2025-10-29 12:24:46.169
783	2025-10-28 21:00:00	235	IN_STORE	\N	0	daily	2025-10-29 12:24:46.17
784	2025-10-28 21:00:00	249	IN_STORE	\N	0	daily	2025-10-29 12:24:46.17
785	2025-10-28 21:00:00	248	IN_STORE	\N	0	daily	2025-10-29 12:24:46.171
786	2025-10-28 21:00:00	250	IN_STORE	\N	0	daily	2025-10-29 12:24:46.172
787	2025-10-28 21:00:00	253	IN_STORE	\N	0	daily	2025-10-29 12:24:46.172
788	2025-10-28 21:00:00	259	IN_STORE	\N	0	daily	2025-10-29 12:24:46.173
789	2025-10-28 21:00:00	261	IN_STORE	\N	0	daily	2025-10-29 12:24:46.173
790	2025-10-28 21:00:00	260	IN_STORE	\N	0	daily	2025-10-29 12:24:46.174
791	2025-10-28 21:00:00	264	IN_STORE	\N	0	daily	2025-10-29 12:24:46.174
792	2025-10-28 21:00:00	262	IN_STORE	\N	0	daily	2025-10-29 12:24:46.175
793	2025-10-28 21:00:00	263	IN_STORE	\N	0	daily	2025-10-29 12:24:46.175
794	2025-10-28 21:00:00	275	IN_STORE	\N	0	daily	2025-10-29 12:24:46.176
795	2025-10-28 21:00:00	274	IN_STORE	\N	0	daily	2025-10-29 12:24:46.176
796	2025-10-28 21:00:00	268	IN_STORE	\N	0	daily	2025-10-29 12:24:46.177
797	2025-10-28 21:00:00	282	IN_STORE	\N	0	daily	2025-10-29 12:24:46.177
798	2025-10-28 21:00:00	270	IN_STORE	\N	0	daily	2025-10-29 12:24:46.178
799	2025-10-28 21:00:00	286	IN_STORE	\N	0	daily	2025-10-29 12:24:46.178
800	2025-10-28 21:00:00	283	IN_STORE	\N	0	daily	2025-10-29 12:24:46.179
801	2025-10-28 21:00:00	277	IN_STORE	\N	0	daily	2025-10-29 12:24:46.179
802	2025-10-28 21:00:00	284	IN_STORE	\N	0	daily	2025-10-29 12:24:46.18
803	2025-10-28 21:00:00	287	IN_STORE	\N	0	daily	2025-10-29 12:24:46.18
804	2025-10-28 21:00:00	281	IN_STORE	\N	0	daily	2025-10-29 12:24:46.181
805	2025-10-28 21:00:00	285	IN_STORE	\N	0	daily	2025-10-29 12:24:46.181
806	2025-10-28 21:00:00	295	IN_STORE	\N	0	daily	2025-10-29 12:24:46.182
807	2025-10-28 21:00:00	296	IN_STORE	\N	0	daily	2025-10-29 12:24:46.182
808	2025-10-28 21:00:00	305	IN_STORE	\N	0	daily	2025-10-29 12:24:46.183
809	2025-10-28 21:00:00	308	IN_STORE	\N	0	daily	2025-10-29 12:24:46.184
810	2025-10-28 21:00:00	299	IN_STORE	\N	0	daily	2025-10-29 12:24:46.184
811	2025-10-28 21:00:00	306	IN_STORE	\N	0	daily	2025-10-29 12:24:46.185
812	2025-10-28 21:00:00	309	IN_STORE	\N	0	daily	2025-10-29 12:24:46.185
813	2025-10-28 21:00:00	301	IN_STORE	\N	0	daily	2025-10-29 12:24:46.186
814	2025-10-28 21:00:00	307	IN_STORE	\N	0	daily	2025-10-29 12:24:46.186
815	2025-10-28 21:00:00	304	IN_STORE	\N	0	daily	2025-10-29 12:24:46.187
816	2025-10-28 21:00:00	317	IN_STORE	\N	0	daily	2025-10-29 12:24:46.187
817	2025-10-28 21:00:00	313	IN_STORE	\N	0	daily	2025-10-29 12:24:46.188
818	2025-10-28 21:00:00	315	IN_STORE	\N	0	daily	2025-10-29 12:24:46.188
819	2025-10-28 21:00:00	314	IN_STORE	\N	0	daily	2025-10-29 12:24:46.189
820	2025-10-28 21:00:00	351	IN_STORE	\N	0	daily	2025-10-29 12:24:46.189
821	2025-10-28 21:00:00	323	IN_STORE	\N	0	daily	2025-10-29 12:24:46.19
822	2025-10-28 21:00:00	327	IN_STORE	\N	0	daily	2025-10-29 12:24:46.19
823	2025-10-28 21:00:00	328	IN_STORE	\N	0	daily	2025-10-29 12:24:46.191
824	2025-10-28 21:00:00	329	IN_STORE	\N	0	daily	2025-10-29 12:24:46.191
825	2025-10-28 21:00:00	335	IN_STORE	\N	0	daily	2025-10-29 12:24:46.192
826	2025-10-28 21:00:00	336	IN_STORE	\N	0	daily	2025-10-29 12:24:46.193
827	2025-10-28 21:00:00	346	IN_STORE	\N	0	daily	2025-10-29 12:24:46.193
828	2025-10-28 21:00:00	345	IN_STORE	\N	0	daily	2025-10-29 12:24:46.194
829	2025-10-28 21:00:00	341	IN_STORE	\N	0	daily	2025-10-29 12:24:46.194
830	2025-10-28 21:00:00	340	IN_STORE	\N	0	daily	2025-10-29 12:24:46.195
831	2025-10-28 21:00:00	344	IN_STORE	\N	0	daily	2025-10-29 12:24:46.195
832	2025-10-28 21:00:00	342	IN_STORE	\N	0	daily	2025-10-29 12:24:46.196
833	2025-10-28 21:00:00	343	IN_STORE	\N	0	daily	2025-10-29 12:24:46.196
834	2025-10-28 21:00:00	359	IN_STORE	\N	0	daily	2025-10-29 12:24:46.197
835	2025-10-28 21:00:00	358	IN_STORE	\N	0	daily	2025-10-29 12:24:46.197
836	2025-10-28 21:00:00	357	IN_STORE	\N	0	daily	2025-10-29 12:24:46.198
837	2025-10-28 21:00:00	356	IN_STORE	\N	0	daily	2025-10-29 12:24:46.198
838	2025-10-28 21:00:00	355	IN_STORE	\N	0	daily	2025-10-29 12:24:46.199
839	2025-10-28 21:00:00	348	IN_STORE	\N	0	daily	2025-10-29 12:24:46.199
840	2025-10-28 21:00:00	347	IN_STORE	\N	0	daily	2025-10-29 12:24:46.2
841	2025-10-28 21:00:00	353	IN_STORE	\N	0	daily	2025-10-29 12:24:46.2
842	2025-10-28 21:00:00	354	IN_STORE	\N	0	daily	2025-10-29 12:24:46.201
843	2025-10-28 21:00:00	352	IN_STORE	\N	0	daily	2025-10-29 12:24:46.202
844	2025-10-28 21:00:00	374	IN_STORE	\N	0	daily	2025-10-29 12:24:46.202
845	2025-10-28 21:00:00	350	IN_STORE	\N	0	daily	2025-10-29 12:24:46.203
846	2025-10-28 21:00:00	349	IN_STORE	\N	0	daily	2025-10-29 12:24:46.203
847	2025-10-28 21:00:00	365	IN_STORE	\N	0	daily	2025-10-29 12:24:46.204
848	2025-10-28 21:00:00	368	IN_STORE	\N	0	daily	2025-10-29 12:24:46.204
849	2025-10-28 21:00:00	366	IN_STORE	\N	0	daily	2025-10-29 12:24:46.205
850	2025-10-28 21:00:00	367	IN_STORE	\N	0	daily	2025-10-29 12:24:46.205
851	2025-10-28 21:00:00	376	IN_STORE	\N	0	daily	2025-10-29 12:24:46.206
852	2025-10-28 21:00:00	375	IN_STORE	\N	0	daily	2025-10-29 12:24:46.206
853	2025-10-28 21:00:00	370	IN_STORE	\N	0	daily	2025-10-29 12:24:46.207
854	2025-10-28 21:00:00	361	IN_STORE	\N	0	daily	2025-10-29 12:24:46.207
855	2025-10-28 21:00:00	378	IN_STORE	\N	0	daily	2025-10-29 12:24:46.208
1078	2025-11-01 21:00:00	285	IN_STORE	\N	0	daily	2025-11-02 12:12:19.732
1079	2025-11-01 21:00:00	295	IN_STORE	\N	0	daily	2025-11-02 12:12:19.733
1080	2025-11-01 21:00:00	296	IN_STORE	\N	0	daily	2025-11-02 12:12:19.734
1081	2025-11-01 21:00:00	305	IN_STORE	\N	0	daily	2025-11-02 12:12:19.735
1082	2025-11-01 21:00:00	299	IN_STORE	\N	0	daily	2025-11-02 12:12:19.735
1083	2025-11-01 21:00:00	306	IN_STORE	\N	0	daily	2025-11-02 12:12:19.736
1084	2025-11-01 21:00:00	301	IN_STORE	\N	0	daily	2025-11-02 12:12:19.737
1085	2025-11-01 21:00:00	307	IN_STORE	\N	0	daily	2025-11-02 12:12:19.737
1086	2025-11-01 21:00:00	304	IN_STORE	\N	0	daily	2025-11-02 12:12:19.738
1087	2025-11-01 21:00:00	317	IN_STORE	\N	0	daily	2025-11-02 12:12:19.739
1088	2025-11-01 21:00:00	313	IN_STORE	\N	0	daily	2025-11-02 12:12:19.739
1089	2025-11-01 21:00:00	315	IN_STORE	\N	0	daily	2025-11-02 12:12:19.74
1090	2025-11-01 21:00:00	314	IN_STORE	\N	0	daily	2025-11-02 12:12:19.74
1091	2025-11-01 21:00:00	351	IN_STORE	\N	0	daily	2025-11-02 12:12:19.741
1092	2025-11-01 21:00:00	323	IN_STORE	\N	0	daily	2025-11-02 12:12:19.741
1093	2025-11-01 21:00:00	327	IN_STORE	\N	0	daily	2025-11-02 12:12:19.742
1094	2025-11-01 21:00:00	328	IN_STORE	\N	0	daily	2025-11-02 12:12:19.742
1095	2025-11-01 21:00:00	329	IN_STORE	\N	0	daily	2025-11-02 12:12:19.743
1096	2025-11-01 21:00:00	335	IN_STORE	\N	0	daily	2025-11-02 12:12:19.743
1097	2025-11-01 21:00:00	336	IN_STORE	\N	0	daily	2025-11-02 12:12:19.744
1098	2025-11-01 21:00:00	346	IN_STORE	\N	0	daily	2025-11-02 12:12:19.744
1099	2025-11-01 21:00:00	345	IN_STORE	\N	0	daily	2025-11-02 12:12:19.745
1100	2025-11-01 21:00:00	341	IN_STORE	\N	0	daily	2025-11-02 12:12:19.746
1101	2025-11-01 21:00:00	340	IN_STORE	\N	0	daily	2025-11-02 12:12:19.746
1102	2025-11-01 21:00:00	344	IN_STORE	\N	0	daily	2025-11-02 12:12:19.748
1103	2025-11-01 21:00:00	342	IN_STORE	\N	0	daily	2025-11-02 12:12:19.749
1104	2025-11-01 21:00:00	343	IN_STORE	\N	0	daily	2025-11-02 12:12:19.749
1105	2025-11-01 21:00:00	359	IN_STORE	\N	0	daily	2025-11-02 12:12:19.75
1106	2025-11-01 21:00:00	358	IN_STORE	\N	0	daily	2025-11-02 12:12:19.75
1107	2025-11-01 21:00:00	357	IN_STORE	\N	0	daily	2025-11-02 12:12:19.751
1108	2025-11-01 21:00:00	356	IN_STORE	\N	0	daily	2025-11-02 12:12:19.752
1109	2025-11-01 21:00:00	355	IN_STORE	\N	0	daily	2025-11-02 12:12:19.752
1110	2025-11-01 21:00:00	348	IN_STORE	\N	0	daily	2025-11-02 12:12:19.753
1111	2025-11-01 21:00:00	347	IN_STORE	\N	0	daily	2025-11-02 12:12:19.753
1112	2025-11-01 21:00:00	353	IN_STORE	\N	0	daily	2025-11-02 12:12:19.754
1113	2025-11-01 21:00:00	354	IN_STORE	\N	0	daily	2025-11-02 12:12:19.754
1114	2025-11-01 21:00:00	352	IN_STORE	\N	0	daily	2025-11-02 12:12:19.755
1115	2025-11-01 21:00:00	374	IN_STORE	\N	0	daily	2025-11-02 12:12:19.755
1116	2025-11-01 21:00:00	350	IN_STORE	\N	0	daily	2025-11-02 12:12:19.756
1117	2025-11-01 21:00:00	349	IN_STORE	\N	0	daily	2025-11-02 12:12:19.756
1118	2025-11-01 21:00:00	365	IN_STORE	\N	0	daily	2025-11-02 12:12:19.757
1119	2025-11-01 21:00:00	368	IN_STORE	\N	0	daily	2025-11-02 12:12:19.757
1120	2025-11-01 21:00:00	366	IN_STORE	\N	0	daily	2025-11-02 12:12:19.758
1121	2025-11-01 21:00:00	367	IN_STORE	\N	0	daily	2025-11-02 12:12:19.758
1122	2025-11-01 21:00:00	376	IN_STORE	\N	0	daily	2025-11-02 12:12:19.759
1123	2025-11-01 21:00:00	375	IN_STORE	\N	0	daily	2025-11-02 12:12:19.759
1124	2025-11-01 21:00:00	370	IN_STORE	\N	0	daily	2025-11-02 12:12:19.76
1125	2025-11-01 21:00:00	361	IN_STORE	\N	0	daily	2025-11-02 12:12:19.76
1126	2025-11-01 21:00:00	378	IN_STORE	\N	0	daily	2025-11-02 12:12:19.761
1127	2025-11-01 21:00:00	395	IN_STORE	\N	0	daily	2025-11-02 12:12:19.761
1128	2025-11-01 21:00:00	399	IN_STORE	\N	0	daily	2025-11-02 12:12:19.762
1129	2025-11-01 21:00:00	396	IN_STORE	\N	0	daily	2025-11-02 12:12:19.762
1130	2025-11-01 21:00:00	400	IN_STORE	\N	0	daily	2025-11-02 12:12:19.763
1131	2025-11-01 21:00:00	401	IN_STORE	\N	0	daily	2025-11-02 12:12:19.763
1132	2025-11-01 21:00:00	397	IN_STORE	\N	0	daily	2025-11-02 12:12:19.764
1133	2025-11-01 21:00:00	393	IN_STORE	\N	0	daily	2025-11-02 12:12:19.764
1134	2025-11-01 21:00:00	394	IN_STORE	\N	0	daily	2025-11-02 12:12:19.765
1135	2025-11-01 21:00:00	398	IN_STORE	\N	0	daily	2025-11-02 12:12:19.765
1136	2025-11-01 21:00:00	418	IN_STORE	\N	0	daily	2025-11-02 12:12:19.766
1137	2025-11-01 21:00:00	415	IN_STORE	\N	0	daily	2025-11-02 12:12:19.766
1138	2025-11-01 21:00:00	412	IN_STORE	\N	0	daily	2025-11-02 12:12:19.767
1139	2025-11-01 21:00:00	416	IN_STORE	\N	0	daily	2025-11-02 12:12:19.767
1140	2025-11-01 21:00:00	419	IN_STORE	\N	0	daily	2025-11-02 12:12:19.768
1141	2025-11-01 21:00:00	413	IN_STORE	\N	0	daily	2025-11-02 12:12:19.768
1142	2025-11-01 21:00:00	417	IN_STORE	\N	0	daily	2025-11-02 12:12:19.769
1143	2025-11-01 21:00:00	407	IN_STORE	\N	0	daily	2025-11-02 12:12:19.769
1144	2025-11-01 21:00:00	406	IN_STORE	\N	0	daily	2025-11-02 12:12:19.77
1145	2025-11-01 21:00:00	153	IN_STORE	\N	0	daily	2025-11-02 12:12:19.77
1146	2025-11-01 21:00:00	423	IN_STORE	\N	0	daily	2025-11-02 12:12:19.771
1147	2025-11-01 21:00:00	157	IN_STORE	\N	0	daily	2025-11-02 12:12:19.771
1148	2025-11-01 21:00:00	126	IN_STORE	\N	0	daily	2025-11-02 12:12:19.772
1149	2025-11-01 21:00:00	430	IN_STORE	\N	0	daily	2025-11-02 12:12:19.772
1150	2025-11-01 21:00:00	431	IN_STORE	\N	0	daily	2025-11-02 12:12:19.773
1151	2025-11-01 21:00:00	193	IN_STORE	\N	0	daily	2025-11-02 12:12:19.773
1152	2025-11-01 21:00:00	194	IN_STORE	\N	0	daily	2025-11-02 12:12:19.774
1153	2025-11-01 21:00:00	442	IN_STORE	\N	0	daily	2025-11-02 12:12:19.774
1154	2025-11-01 21:00:00	437	IN_STORE	\N	0	daily	2025-11-02 12:12:19.775
1155	2025-11-01 21:00:00	443	IN_STORE	\N	0	daily	2025-11-02 12:12:19.776
1156	2025-11-01 21:00:00	438	IN_STORE	\N	0	daily	2025-11-02 12:12:19.776
1157	2025-11-01 21:00:00	444	IN_STORE	\N	0	daily	2025-11-02 12:12:19.777
1158	2025-11-01 21:00:00	201	IN_STORE	\N	0	daily	2025-11-02 12:12:19.777
1159	2025-11-01 21:00:00	202	IN_STORE	\N	0	daily	2025-11-02 12:12:19.778
1160	2025-11-01 21:00:00	294	IN_STORE	\N	0	daily	2025-11-02 12:12:19.778
1161	2025-11-01 21:00:00	144	IN_STORE	\N	0	daily	2025-11-02 12:12:19.779
1162	2025-11-01 21:00:00	427	IN_STORE	\N	0	daily	2025-11-02 12:12:19.779
1163	2025-11-01 21:00:00	428	IN_STORE	\N	0	daily	2025-11-02 12:12:19.78
1164	2025-11-01 21:00:00	429	IN_STORE	\N	0	daily	2025-11-02 12:12:19.78
1165	2025-11-01 21:00:00	453	IN_STORE	\N	0	daily	2025-11-02 12:12:19.781
1166	2025-11-01 21:00:00	454	IN_STORE	\N	0	daily	2025-11-02 12:12:19.782
1167	2025-11-01 21:00:00	465	IN_STORE	\N	0	daily	2025-11-02 12:12:19.782
1168	2025-11-01 21:00:00	459	IN_STORE	\N	0	daily	2025-11-02 12:12:19.783
1169	2025-11-01 21:00:00	466	IN_STORE	\N	0	daily	2025-11-02 12:12:19.783
1170	2025-11-01 21:00:00	462	IN_STORE	\N	0	daily	2025-11-02 12:12:19.784
1171	2025-11-01 21:00:00	471	IN_STORE	\N	0	daily	2025-11-02 12:12:19.784
1172	2025-11-01 21:00:00	481	IN_STORE	\N	0	daily	2025-11-02 12:12:19.785
1173	2025-11-01 21:00:00	485	IN_STORE	\N	0	daily	2025-11-02 12:12:19.785
1174	2025-11-01 21:00:00	477	IN_STORE	\N	0	daily	2025-11-02 12:12:19.786
1175	2025-11-01 21:00:00	480	IN_STORE	\N	0	daily	2025-11-02 12:12:19.786
1176	2025-11-01 21:00:00	490	IN_STORE	\N	0	daily	2025-11-02 12:12:19.787
1177	2025-11-01 21:00:00	491	IN_STORE	\N	0	daily	2025-11-02 12:12:19.787
1178	2025-11-01 21:00:00	492	IN_STORE	\N	0	daily	2025-11-02 12:12:19.788
1179	2025-11-01 21:00:00	493	IN_STORE	\N	0	daily	2025-11-02 12:12:19.788
1180	2025-11-01 21:00:00	499	IN_STORE	\N	0	daily	2025-11-02 12:12:19.789
\.


--
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_images (id, "productId", filename, path, "isMain", "createdAt", "githubUrl", "localPath", "storageType") FROM stdin;
1	1	SG-35C14.webp	/media/products/1/SG-35C14.webp	t	2025-10-24 12:29:56.578	\N	/media/products/1/SG-35C14.webp	local
2	2	622021.webp	/media/products/2/622021.webp	t	2025-10-24 12:39:02.364	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/2/622021.webp	/media/products/2/622021.webp	github
3	3	1767540.webp	/media/products/3/1767540.webp	t	2025-10-25 06:45:28.308	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/3/1767540.webp	/media/products/3/1767540.webp	github
4	4	CAEA1208.webp	/media/products/4/CAEA1208.webp	t	2025-10-25 06:54:10.528	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/4/CAEA1208.webp	/media/products/4/CAEA1208.webp	github
5	5	FSEB1240.webp	/media/products/5/FSEB1240.webp	t	2025-10-25 06:58:36.502	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/5/FSEB1240.webp	/media/products/5/FSEB1240.webp	github
6	6	1763040.webp	/media/products/6/1763040.webp	t	2025-10-25 07:10:53.593	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/6/1763040.webp	/media/products/6/1763040.webp	github
7	8	ST4581.webp	/media/products/8/ST4581.webp	t	2025-10-25 07:42:34.359	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/8/ST4581.webp	/media/products/8/ST4581.webp	github
8	9	622017.webp	/media/products/9/622017.webp	t	2025-10-25 07:51:59.521	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/9/622017.webp	/media/products/9/622017.webp	github
9	11	54917.webp	/media/products/11/54917.webp	t	2025-10-25 08:02:05.476	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/11/54917.webp	/media/products/11/54917.webp	github
10	12	63005B.webp	/media/products/12/63005B.webp	t	2025-10-25 08:07:43.938	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/12/63005B.webp	/media/products/12/63005B.webp	github
11	13	YT0590.webp	/media/products/13/YT0590.webp	t	2025-10-25 08:10:04.33	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/13/YT0590.webp	/media/products/13/YT0590.webp	github
12	14	620 017.webp	/media/products/14/620 017.webp	t	2025-10-25 08:15:57.139	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/14/620%20017.webp	/media/products/14/620 017.webp	github
13	15	54517.webp	/media/products/15/54517.webp	t	2025-10-25 08:19:45.075	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/15/54517.webp	/media/products/15/54517.webp	github
14	16	BAEA1617.webp	/media/products/16/BAEA1617.webp	t	2025-10-25 08:25:22.555	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/16/BAEA1617.webp	/media/products/16/BAEA1617.webp	github
15	17	rf52508.webp	/media/products/17/rf52508.webp	t	2025-10-25 08:41:48.745	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/17/rf52508.webp	/media/products/17/rf52508.webp	github
16	18	32332065.webp	/media/products/18/32332065.webp	t	2025-10-25 08:44:47.161	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/18/32332065.webp	/media/products/18/32332065.webp	github
17	19	321322.webp	/media/products/19/321322.webp	t	2025-10-25 08:46:48.482	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/19/321322.webp	/media/products/19/321322.webp	github
18	21	825206.webp	/media/products/21/825206.webp	t	2025-10-25 09:20:45.548	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/21/825206.webp	/media/products/21/825206.webp	github
19	22	FK-905M11.webp	/media/products/22/FK-905M11.webp	t	2025-10-25 09:26:20.976	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/22/FK-905M11.webp	/media/products/22/FK-905M11.webp	github
20	23	RF-1767555 Premium.webp	/media/products/23/RF-1767555 Premium.webp	t	2025-10-25 09:43:23.408	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/23/RF-1767555%20Premium.webp	/media/products/23/RF-1767555 Premium.webp	github
21	24	JCB-4167-5MPB.webp	/media/products/24/JCB-4167-5MPB.webp	t	2025-10-25 09:51:09.768	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/24/JCB-4167-5MPB.webp	/media/products/24/JCB-4167-5MPB.webp	github
22	25	jcb52510.webp	/media/products/25/jcb52510.webp	t	2025-10-25 10:32:50.132	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/25/jcb52510.webp	/media/products/25/jcb52510.webp	github
23	26	800 410.webp	/media/products/26/800 410.webp	t	2025-10-25 10:37:20.102	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/26/800%20410.webp	/media/products/26/800 410.webp	github
24	27	FK-933T1-12P.webp	/media/products/27/FK-933T1-12P.webp	t	2025-10-25 10:47:12.337	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/27/FK-933T1-12P.webp	/media/products/27/FK-933T1-12P.webp	github
25	28	KACN160B.webp	/media/products/28/KACN160B.webp	t	2025-10-25 12:11:20.722	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/28/KACN160B.webp	/media/products/28/KACN160B.webp	github
26	29	40290.webp	/media/products/29/40290.webp	t	2025-10-25 12:16:50.697	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/29/40290.webp	/media/products/29/40290.webp	github
27	30	622019.webp	/media/products/30/622019.webp	t	2025-10-25 12:20:52.666	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/30/622019.webp	/media/products/30/622019.webp	github
28	31	rf802222.webp	/media/products/31/rf802222.webp	t	2025-10-25 12:50:03.63	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/31/rf802222.webp	/media/products/31/rf802222.webp	github
29	32	F-5161MP.webp	/media/products/32/F-5161MP.webp	t	2025-10-27 10:48:05.773	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/32/F-5161MP.webp	/media/products/32/F-5161MP.webp	github
30	33	JCB-41082-5.webp	/media/products/33/JCB-41082-5.webp	t	2025-10-27 11:11:47.435	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/33/JCB-41082-5.webp	/media/products/33/JCB-41082-5.webp	github
31	34	80634.webp	/media/products/34/80634.webp	t	2025-10-27 11:17:03.312	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/34/80634.webp	/media/products/34/80634.webp	github
32	35	FK-44836.webp	/media/products/35/FK-44836.webp	t	2025-10-27 11:22:56.715	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/35/FK-44836.webp	/media/products/35/FK-44836.webp	github
33	36	660019.webp	/media/products/36/660019.webp	t	2025-10-27 11:26:25.383	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/36/660019.webp	/media/products/36/660019.webp	github
34	37	ABG-20.webp	/media/products/37/ABG-20.webp	t	2025-10-27 11:31:22.885	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/37/ABG-20.webp	/media/products/37/ABG-20.webp	github
35	38	YT-38510.webp	/media/products/38/YT-38510.webp	t	2025-10-28 09:21:56.332	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/38/YT-38510.webp	/media/products/38/YT-38510.webp	github
36	39	ER-53825.webp	/media/products/39/ER-53825.webp	t	2025-10-28 09:33:10.9	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/39/ER-53825.webp	/media/products/39/ER-53825.webp	github
37	40	ST5025.webp	/media/products/40/ST5025.webp	t	2025-10-28 09:40:30.186	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/40/ST5025.webp	/media/products/40/ST5025.webp	github
38	41	F-HB140.webp	/media/products/41/F-HB140.webp	t	2025-10-28 09:45:05.613	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/41/F-HB140.webp	/media/products/41/F-HB140.webp	github
39	42	RF-HB140.webp	/media/products/42/RF-HB140.webp	t	2025-10-28 09:46:01.613	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/42/RF-HB140.webp	/media/products/42/RF-HB140.webp	github
40	43	F-340122113.webp	/media/products/43/F-340122113.webp	t	2025-10-28 09:50:58.152	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/43/F-340122113.webp	/media/products/43/F-340122113.webp	github
41	45	RF-807421.webp	/media/products/45/RF-807421.webp	t	2025-10-28 10:09:10.359	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/45/RF-807421.webp	/media/products/45/RF-807421.webp	github
42	47	FSEB1250.webp	/media/products/47/FSEB1250.webp	t	2025-10-28 10:24:05.844	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/47/FSEB1250.webp	/media/products/47/FSEB1250.webp	github
43	48	RF-1767545 Premium.webp	/media/products/48/RF-1767545 Premium.webp	t	2025-10-28 10:31:45.535	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/48/RF-1767545%20Premium.webp	/media/products/48/RF-1767545 Premium.webp	github
44	49	FSEB1245.webp	/media/products/49/FSEB1245.webp	t	2025-10-28 10:32:46.157	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/49/FSEB1245.webp	/media/products/49/FSEB1245.webp	github
45	50	1767530.webp	/media/products/50/1767530.webp	t	2025-10-28 10:42:52.839	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/50/1767530.webp	/media/products/50/1767530.webp	github
46	52	FSEA1245.webp	/media/products/52/FSEA1245.webp	t	2025-10-28 12:03:40.401	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/52/FSEA1245.webp	/media/products/52/FSEA1245.webp	github
47	53	F-75532.webp	/media/products/53/F-75532.webp	t	2025-10-28 12:10:27.809	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/53/F-75532.webp	/media/products/53/F-75532.webp	github
48	55	539 210.webp	/media/products/55/539 210.webp	t	2025-10-28 12:33:20.895	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/55/539%20210.webp	/media/products/55/539 210.webp	github
49	57	560 008.webp	/media/products/57/560 008.webp	t	2025-10-28 12:44:10.99	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/57/560%20008.webp	/media/products/57/560 008.webp	github
50	58	560 010.webp	/media/products/58/560 010.webp	t	2025-10-28 12:45:11.81	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/58/560%20010.webp	/media/products/58/560 010.webp	github
51	59	1783007.webp	/media/products/59/1783007.webp	t	2025-10-29 06:17:58.922	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/59/1783007.webp	/media/products/59/1783007.webp	github
52	60	R7300141.webp	/media/products/60/R7300141.webp	t	2025-10-29 07:29:23.49	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/60/R7300141.webp	/media/products/60/R7300141.webp	github
53	61	R7300121.webp	/media/products/61/R7300121.webp	t	2025-10-29 07:33:40.278	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/61/R7300121.webp	/media/products/61/R7300121.webp	github
54	62	R7300382.webp	/media/products/62/R7300382.webp	t	2025-10-29 07:34:42.876	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/62/R7300382.webp	/media/products/62/R7300382.webp	github
55	63	HZ 27.1.047W.webp	/media/products/63/HZ 27.1.047W.webp	t	2025-10-29 07:45:13.223	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/63/HZ%2027.1.047W.webp	/media/products/63/HZ 27.1.047W.webp	github
56	64	CHAG0813.webp	/media/products/64/CHAG0813.webp	t	2025-10-29 08:16:03.992	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/64/CHAG0813.webp	/media/products/64/CHAG0813.webp	github
57	65	BM-802222.webp	/media/products/65/BM-802222.webp	t	2025-10-29 08:24:00.392	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/65/BM-802222.webp	/media/products/65/BM-802222.webp	github
58	66	CJBG0815.webp	/media/products/66/CJBG0815.webp	t	2025-10-29 08:26:53.886	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/66/CJBG0815.webp	/media/products/66/CJBG0815.webp	github
59	67	80222.webp	/media/products/67/80222.webp	t	2025-10-29 08:29:41.032	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/67/80222.webp	/media/products/67/80222.webp	github
60	68	Sch-TAP14x1.5.webp	/media/products/68/Sch-TAP14x1.5.webp	t	2025-10-29 08:34:48.826	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/68/Sch-TAP14x1.5.webp	/media/products/68/Sch-TAP14x1.5.webp	github
61	69	ER13130.webp	/media/products/69/ER13130.webp	t	2025-10-29 08:39:33.56	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/69/ER13130.webp	/media/products/69/ER13130.webp	github
62	70	270055.webp	/media/products/70/270055.webp	t	2025-10-29 08:43:51.055	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/70/270055.webp	/media/products/70/270055.webp	github
63	71	1767545.webp	/media/products/71/1767545.webp	t	2025-10-29 08:47:35.618	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/71/1767545.webp	/media/products/71/1767545.webp	github
64	72	39775.webp	/media/products/72/39775.webp	t	2025-10-29 08:54:49.255	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/72/39775.webp	/media/products/72/39775.webp	github
65	73	SB31020.webp	/media/products/73/SB31020.webp	t	2025-10-29 08:58:01.207	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/73/SB31020.webp	/media/products/73/SB31020.webp	github
66	74	RF-9T0801.webp	/media/products/74/RF-9T0801.webp	t	2025-10-29 09:03:05.189	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/74/RF-9T0801.webp	/media/products/74/RF-9T0801.webp	github
67	75	608 745.webp	/media/products/75/608 745.webp	t	2025-10-29 09:09:34.197	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/75/608%20745.webp	/media/products/75/608 745.webp	github
68	76	Sch-TAP12x1.75.webp	/media/products/76/Sch-TAP12x1.75.webp	t	2025-10-29 09:17:21.256	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/76/Sch-TAP12x1.75.webp	/media/products/76/Sch-TAP12x1.75.webp	github
69	77	RF-TAP10x1,25.webp	/media/products/77/RF-TAP10x1,25.webp	t	2025-10-29 09:21:54.412	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/77/RF-TAP10x1%2C25.webp	/media/products/77/RF-TAP10x1,25.webp	github
70	78	Sch-TAP10x1,5.webp	/media/products/78/Sch-TAP10x1,5.webp	t	2025-10-29 09:23:01.584	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/78/Sch-TAP10x1%2C5.webp	/media/products/78/Sch-TAP10x1,5.webp	github
71	79	ER01010M.webp	/media/products/79/ER01010M.webp	t	2025-10-29 09:25:11.669	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/79/ER01010M.webp	/media/products/79/ER01010M.webp	github
72	80	Sch-TAP9x1.webp	/media/products/80/Sch-TAP9x1.webp	t	2025-10-29 09:29:06.623	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/80/Sch-TAP9x1.webp	/media/products/80/Sch-TAP9x1.webp	github
73	81	Sch-TAP8x1,25.webp	/media/products/81/Sch-TAP8x1,25.webp	t	2025-10-29 09:31:08.951	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/81/Sch-TAP8x1%2C25.webp	/media/products/81/Sch-TAP8x1,25.webp	github
74	82	Sch-TAP8x1.webp	/media/products/82/Sch-TAP8x1.webp	t	2025-10-29 09:32:47.938	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/82/Sch-TAP8x1.webp	/media/products/82/Sch-TAP8x1.webp	github
75	83	FK-46510027.webp	/media/products/83/FK-46510027.webp	t	2025-10-29 09:56:01.41	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/83/FK-46510027.webp	/media/products/83/FK-46510027.webp	github
76	85	HZ 25.1.281W.webp	/media/products/85/HZ 25.1.281W.webp	t	2025-10-29 10:43:42.218	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/85/HZ%2025.1.281W.webp	/media/products/85/HZ 25.1.281W.webp	github
77	86	628 745.webp	/media/products/86/628 745.webp	t	2025-10-29 10:50:02.737	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/86/628%20745.webp	/media/products/86/628 745.webp	github
78	87	R7300381.webp	/media/products/87/R7300381.webp	t	2025-10-30 07:46:53.266	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/87/R7300381.webp	/media/products/87/R7300381.webp	github
79	88	JCB-75510.webp	/media/products/88/JCB-75510.webp	t	2025-10-30 07:54:17.714	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/88/JCB-75510.webp	/media/products/88/JCB-75510.webp	github
80	89	JCB-75508.webp	/media/products/89/JCB-75508.webp	t	2025-10-30 07:58:28.966	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/89/JCB-75508.webp	/media/products/89/JCB-75508.webp	github
81	90	RF-8143.webp	/media/products/90/RF-8143.webp	t	2025-10-30 08:12:19.461	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/90/RF-8143.webp	/media/products/90/RF-8143.webp	github
82	92	600 057.webp	/media/products/92/600 057.webp	t	2025-10-30 08:33:48.165	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/92/600%20057.webp	/media/products/92/600 057.webp	github
83	93	BAEA0807.webp	/media/products/93/BAEA0807.webp	t	2025-10-30 08:37:50.758	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/93/BAEA0807.webp	/media/products/93/BAEA0807.webp	github
84	94	KAJA18C1.webp	/media/products/94/KAJA18C1.webp	t	2025-10-30 09:42:23.978	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/94/KAJA18C1.webp	/media/products/94/KAJA18C1.webp	github
85	95	80942.webp	/media/products/95/80942.webp	t	2025-10-30 09:52:33.942	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/95/80942.webp	/media/products/95/80942.webp	github
86	96	603 008.webp	/media/products/96/603 008.webp	t	2025-10-30 09:59:30.431	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/96/603%20008.webp	/media/products/96/603 008.webp	github
87	97	839 816.webp	/media/products/97/839 816.webp	t	2025-10-30 10:07:45.049	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/97/839%20816.webp	/media/products/97/839 816.webp	github
88	98	839 822.webp	/media/products/98/839 822.webp	t	2025-10-30 10:08:30.125	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/98/839%20822.webp	/media/products/98/839 822.webp	github
89	99	40574.webp	/media/products/99/40574.webp	t	2025-11-02 10:32:18.605	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/99/40574.webp	/media/products/99/40574.webp	github
90	100	JCB-76413.webp	/media/products/100/JCB-76413.webp	t	2025-11-02 10:40:48.38	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/100/JCB-76413.webp	/media/products/100/JCB-76413.webp	github
91	101	JCB-76416.webp	/media/products/101/JCB-76416.webp	t	2025-11-02 10:44:08.305	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/101/JCB-76416.webp	/media/products/101/JCB-76416.webp	github
92	102	JCB-76418.webp	/media/products/102/JCB-76418.webp	t	2025-11-02 10:46:46.392	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/102/JCB-76418.webp	/media/products/102/JCB-76418.webp	github
93	103	JCB-76419.webp	/media/products/103/JCB-76419.webp	t	2025-11-02 10:47:49.841	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/103/JCB-76419.webp	/media/products/103/JCB-76419.webp	github
94	104	JCB-76417.webp	/media/products/104/JCB-76417.webp	t	2025-11-02 10:49:03.626	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/104/JCB-76417.webp	/media/products/104/JCB-76417.webp	github
95	105	RF-60316175.webp	/media/products/105/RF-60316175.webp	t	2025-11-02 10:55:37.226	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/105/RF-60316175.webp	/media/products/105/RF-60316175.webp	github
96	106	669 450.webp	/media/products/106/669 450.webp	t	2025-11-02 11:01:13.586	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/106/669%20450.webp	/media/products/106/669 450.webp	github
97	108	F-T43001C ST.webp	/media/products/108/F-T43001C ST.webp	t	2025-11-02 11:23:26.327	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/108/F-T43001C%20ST.webp	/media/products/108/F-T43001C ST.webp	github
98	109	CAEA1612.webp	/media/products/109/CAEA1612.webp	t	2025-11-02 11:31:49.404	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/109/CAEA1612.webp	/media/products/109/CAEA1612.webp	github
99	110	BCFA1660.webp	/media/products/110/BCFA1660.webp	t	2025-11-02 11:36:04.242	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/110/BCFA1660.webp	/media/products/110/BCFA1660.webp	github
100	111	R7703502.webp	/media/products/111/R7703502.webp	t	2025-11-02 11:53:36.568	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/111/R7703502.webp	/media/products/111/R7703502.webp	github
101	112	PRO-6065.webp	/media/products/112/PRO-6065.webp	t	2025-11-03 08:59:37.459	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/112/PRO-6065.webp	/media/products/112/PRO-6065.webp	github
102	113	766906.webp	/media/products/113/766906.webp	t	2025-11-03 09:05:30.266	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/113/766906.webp	/media/products/113/766906.webp	github
103	114	RF-8014750U.webp	/media/products/114/RF-8014750U.webp	t	2025-11-03 09:13:04.279	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/114/RF-8014750U.webp	/media/products/114/RF-8014750U.webp	github
104	115	RF-44519.webp	/media/products/115/RF-44519.webp	t	2025-11-03 09:16:54.795	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/115/RF-44519.webp	/media/products/115/RF-44519.webp	github
105	116	FK-56946.webp	/media/products/116/FK-56946.webp	t	2025-11-03 09:19:59.871	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/116/FK-56946.webp	/media/products/116/FK-56946.webp	github
106	117	PA-68-175HS.webp	/media/products/117/PA-68-175HS.webp	t	2025-11-03 09:25:36.287	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/117/PA-68-175HS.webp	/media/products/117/PA-68-175HS.webp	github
\.


--
-- Data for Name: product_sales_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_sales_history (id, "productUnitId", "cashEventId", "periodDate", "periodType", "salePrice", "soldAt", "createdAt") FROM stdin;
\.


--
-- Data for Name: product_unit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_unit_logs (id, "productUnitId", type, message, meta, "createdAt") FROM stdin;
1	1	SYSTEM	Unit автоматически создан из продукта Пистолет для антикоррозионных покрытий SG-35C14 ECO со шлангом	\N	2025-10-24 12:30:32.142
2	1	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-24 12:30:41.906
3	2	SYSTEM	CLEAR unit создан как замена для кандидата #SG-35C14-20251024-153032140-515202	{"purpose": "replacement_for_candidate", "sourceUnitId": 1, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "SG-35C14-20251024-153032140-515202"}	2025-10-24 12:31:14.961
4	1	IN_REQUEST	Создана одиночная заявка, цена: 27.49	{"pricePerUnit": 27.49, "clearReplacementUnitId": 2}	2025-10-24 12:31:14.974
5	1	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-24 12:31:19.532
6	1	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-24 12:31:19.535
7	1	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-24 12:31:19.537
8	1	SALE	Товар продан за 35 ₽	{"isCredit": false, "buyerName": "", "salePrice": 35, "buyerPhone": ""}	2025-10-24 12:31:56.105
9	3	SYSTEM	Unit автоматически создан из продукта Головка двенадцатигранная 21 мм 1/2"	\N	2025-10-24 12:39:09.717
10	3	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-24 12:39:23.956
11	4	SYSTEM	CLEAR unit создан как замена для кандидата #622021-20251024-153909716-735277	{"purpose": "replacement_for_candidate", "sourceUnitId": 3, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "622021-20251024-153909716-735277"}	2025-10-24 12:40:41.596
12	3	IN_REQUEST	Создана одиночная заявка, цена: 3.18	{"pricePerUnit": 3.18, "clearReplacementUnitId": 4}	2025-10-24 12:40:41.609
13	3	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-24 12:40:43.844
14	3	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-24 12:40:43.846
15	3	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-24 12:40:43.848
16	3	SALE	Товар продан за 6 ₽	{"isCredit": false, "buyerName": "", "salePrice": 6, "buyerPhone": ""}	2025-10-24 12:41:07.508
17	2	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-24 12:44:26.345
18	5	SYSTEM	CLEAR unit создан как замена для кандидата #SG-35C14-20251024-153114960-841163	{"purpose": "replacement_for_candidate", "sourceUnitId": 2, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "SG-35C14-20251024-153114960-841163"}	2025-10-24 12:44:48.095
19	2	SPROUTED	Unit преобразован в SPROUTED для создания 2 дочерних заявок	{"pricePerUnit": 27.49, "childrenCount": 2}	2025-10-24 12:44:48.109
20	6	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 1, "parentUnitId": 2}	2025-10-24 12:44:48.112
21	7	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 2, "parentUnitId": 2}	2025-10-24 12:44:48.115
22	6	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-24 12:45:15.473
23	6	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-24 12:45:15.475
24	6	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-24 12:45:15.477
25	7	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-24 12:45:18.861
26	7	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-24 12:45:18.863
27	7	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-24 12:45:18.865
28	8	SYSTEM	Unit автоматически создан из продукта Бита Torx T40 10 мм. FORCE 1767540	\N	2025-10-25 06:45:36.36
29	8	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-25 06:45:54.1
30	9	SYSTEM	CLEAR unit создан как замена для кандидата #1767540-20251025-094536358-287384	{"purpose": "replacement_for_candidate", "sourceUnitId": 8, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "1767540-20251025-094536358-287384"}	2025-10-25 06:49:34.935
31	8	SPROUTED	Unit преобразован в SPROUTED для создания 6 дочерних заявок	{"pricePerUnit": 3.06, "childrenCount": 6}	2025-10-25 06:49:34.951
32	10	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 6, "sequence": 1, "parentUnitId": 8}	2025-10-25 06:49:34.954
33	11	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 6, "sequence": 2, "parentUnitId": 8}	2025-10-25 06:49:34.958
34	12	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 6, "sequence": 3, "parentUnitId": 8}	2025-10-25 06:49:34.962
35	13	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 6, "sequence": 4, "parentUnitId": 8}	2025-10-25 06:49:34.966
36	14	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 6, "sequence": 5, "parentUnitId": 8}	2025-10-25 06:49:34.969
37	15	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 6, "sequence": 6, "parentUnitId": 8}	2025-10-25 06:49:34.972
38	10	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 06:49:53.732
39	10	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 06:49:53.735
40	10	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 06:49:53.737
41	11	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 06:49:54.368
42	11	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 06:49:54.371
43	11	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 06:49:54.373
44	12	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 06:49:55.957
45	12	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 06:49:55.959
46	12	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 06:49:55.961
47	13	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 06:49:57.053
48	13	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 06:49:57.055
49	13	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 06:49:57.057
50	14	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 06:49:57.894
51	14	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 06:49:57.896
52	14	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 06:49:57.898
53	15	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 06:49:58.605
54	15	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 06:49:58.607
55	15	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 06:49:58.608
56	15	SALE	Товар продан за 6 ₽	{"isCredit": false, "buyerName": "", "salePrice": 6, "buyerPhone": ""}	2025-10-25 06:50:20.092
57	16	SYSTEM	Unit автоматически создан из продукта Переходник 3/8"(F)х1/4(М) TOPTUL	\N	2025-10-25 06:54:19.395
58	16	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-25 06:54:38.549
59	17	SYSTEM	CLEAR unit создан как замена для кандидата #CAEA1208-20251025-095419393-323579	{"purpose": "replacement_for_candidate", "sourceUnitId": 16, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "CAEA1208-20251025-095419393-323579"}	2025-10-25 06:55:32.806
60	16	SPROUTED	Unit преобразован в SPROUTED для создания 3 дочерних заявок	{"pricePerUnit": 1.74, "childrenCount": 3}	2025-10-25 06:55:32.812
61	18	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 1, "parentUnitId": 16}	2025-10-25 06:55:32.815
62	19	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 2, "parentUnitId": 16}	2025-10-25 06:55:32.818
63	20	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 3, "parentUnitId": 16}	2025-10-25 06:55:32.821
64	18	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 06:55:43.724
65	18	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 06:55:43.726
66	18	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 06:55:43.728
67	19	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 06:55:45.079
68	19	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 06:55:45.081
69	19	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 06:55:45.083
70	20	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 06:55:46.314
71	20	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 06:55:46.316
72	20	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 06:55:46.318
73	20	SALE	Товар продан за 5 ₽	{"isCredit": false, "buyerName": "", "salePrice": 5, "buyerPhone": ""}	2025-10-25 06:56:07.023
74	21	SYSTEM	Unit автоматически создан из продукта Насадка TORX T40 75мм LONG TOPTUL	\N	2025-10-25 07:04:25.031
75	21	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-25 07:04:40.984
76	22	SYSTEM	CLEAR unit создан как замена для кандидата #FSEB1240-20251025-100425029-550485	{"purpose": "replacement_for_candidate", "sourceUnitId": 21, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "FSEB1240-20251025-100425029-550485"}	2025-10-25 07:05:17.003
77	21	SPROUTED	Unit преобразован в SPROUTED для создания 3 дочерних заявок	{"pricePerUnit": 3.27, "childrenCount": 3}	2025-10-25 07:05:17.018
78	23	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 1, "parentUnitId": 21}	2025-10-25 07:05:17.021
79	24	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 2, "parentUnitId": 21}	2025-10-25 07:05:17.025
80	25	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 3, "parentUnitId": 21}	2025-10-25 07:05:17.028
81	23	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 07:05:27.959
82	23	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 07:05:27.962
83	23	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 07:05:27.964
84	24	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 07:05:28.484
85	24	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 07:05:28.486
86	24	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 07:05:28.488
87	25	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 07:05:29.526
88	25	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 07:05:29.528
89	25	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 07:05:29.53
90	26	SYSTEM	Unit автоматически создан из продукта Бита Torx T40 10 мм. FORCE 1763040	\N	2025-10-25 07:11:17.416
91	26	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-25 07:11:32.867
92	27	SYSTEM	CLEAR unit создан как замена для кандидата #1763040-20251025-101117415-361590	{"purpose": "replacement_for_candidate", "sourceUnitId": 26, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "1763040-20251025-101117415-361590"}	2025-10-25 07:11:59.69
93	26	SPROUTED	Unit преобразован в SPROUTED для создания 5 дочерних заявок	{"pricePerUnit": 2.22, "childrenCount": 5}	2025-10-25 07:11:59.704
94	28	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 1, "parentUnitId": 26}	2025-10-25 07:11:59.707
95	29	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 2, "parentUnitId": 26}	2025-10-25 07:11:59.71
96	30	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 3, "parentUnitId": 26}	2025-10-25 07:11:59.713
97	31	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 4, "parentUnitId": 26}	2025-10-25 07:11:59.717
98	32	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 5, "parentUnitId": 26}	2025-10-25 07:11:59.72
99	28	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 07:12:08.764
100	28	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 07:12:08.767
101	28	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 07:12:08.769
102	29	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 07:12:09.382
103	29	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 07:12:09.384
104	29	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 07:12:09.386
105	30	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 07:12:10.278
106	30	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 07:12:10.281
107	30	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 07:12:10.283
108	31	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 07:12:13.109
109	31	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 07:12:13.111
110	31	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 07:12:13.113
111	32	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 07:12:13.864
112	32	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 07:12:13.866
113	32	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 07:12:13.868
114	33	SYSTEM	Unit автоматически создан из продукта ARNEZI R7401001 Поддон для слива масла 8 л.	\N	2025-10-25 07:33:08.425
115	33	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-25 07:33:32.463
116	34	SYSTEM	CLEAR unit создан как замена для кандидата #R7401001-20251025-103308424-642495	{"purpose": "replacement_for_candidate", "sourceUnitId": 33, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "R7401001-20251025-103308424-642495"}	2025-10-25 07:34:13.737
117	33	IN_REQUEST	Создана одиночная заявка, цена: 21.54	{"pricePerUnit": 21.54, "clearReplacementUnitId": 34}	2025-10-25 07:34:13.75
118	33	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 07:34:17.184
119	33	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 07:34:17.187
120	33	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 07:34:17.189
121	35	SYSTEM	Unit автоматически создан из продукта Заклепочник поворотный усиленный 2,4-4,8мм STARTUL PROFI (ST4581)	\N	2025-10-25 07:42:47.034
122	35	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-25 07:43:04.856
123	36	SYSTEM	CLEAR unit создан как замена для кандидата #ST4581-20251025-104247033-208418	{"purpose": "replacement_for_candidate", "sourceUnitId": 35, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "ST4581-20251025-104247033-208418"}	2025-10-25 07:43:32.733
124	35	IN_REQUEST	Создана одиночная заявка, цена: 34.55	{"pricePerUnit": 34.55, "clearReplacementUnitId": 36}	2025-10-25 07:43:32.745
125	35	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 07:43:36.77
126	35	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 07:43:36.772
127	35	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 07:43:36.774
128	35	SALE	Товар продан за 50 ₽	{"isCredit": false, "buyerName": "", "salePrice": 50, "buyerPhone": ""}	2025-10-25 07:44:07.914
129	37	SYSTEM	Unit автоматически создан из продукта Головка двенадцатигранная 17мм 1/2"	\N	2025-10-25 07:52:55.383
130	37	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-25 07:53:23.655
131	38	SYSTEM	CLEAR unit создан как замена для кандидата #622017-20251025-105255381-772913	{"purpose": "replacement_for_candidate", "sourceUnitId": 37, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "622017-20251025-105255381-772913"}	2025-10-25 07:53:57.195
132	37	SPROUTED	Unit преобразован в SPROUTED для создания 2 дочерних заявок	{"pricePerUnit": 2.4, "childrenCount": 2}	2025-10-25 07:53:57.209
133	39	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 1, "parentUnitId": 37}	2025-10-25 07:53:57.212
134	40	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 2, "parentUnitId": 37}	2025-10-25 07:53:57.215
135	39	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 07:54:13.24
136	39	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 07:54:13.242
137	39	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 07:54:13.244
138	40	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 07:54:14.047
139	40	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 07:54:14.049
140	40	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 07:54:14.051
141	41	SYSTEM	Unit автоматически создан из продукта Головка 1/2" 17мм 12гр.TOPTUL	\N	2025-10-25 07:56:28.452
142	41	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-25 07:56:46.534
143	42	SYSTEM	CLEAR unit создан как замена для кандидата #BAEB1617-20251025-105628451-379900	{"purpose": "replacement_for_candidate", "sourceUnitId": 41, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "BAEB1617-20251025-105628451-379900"}	2025-10-25 07:57:23.018
144	41	IN_REQUEST	Создана одиночная заявка, цена: 3.22	{"pricePerUnit": 3.22, "clearReplacementUnitId": 42}	2025-10-25 07:57:23.031
145	41	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 07:57:25.605
146	41	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 07:57:25.607
147	41	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 07:57:25.609
148	43	SYSTEM	Unit автоматически создан из продукта Головка 17 мм 12-гранная 1/2DR короткая FORCE 54917	\N	2025-10-25 08:02:21.052
149	43	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-25 08:02:47.283
150	44	SYSTEM	CLEAR unit создан как замена для кандидата #54917-20251025-110221051-497690	{"purpose": "replacement_for_candidate", "sourceUnitId": 43, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "54917-20251025-110221051-497690"}	2025-10-25 08:03:20.962
151	43	IN_REQUEST	Создана одиночная заявка, цена: 6.96	{"pricePerUnit": 6.96, "clearReplacementUnitId": 44}	2025-10-25 08:03:20.966
152	43	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 08:03:23.814
153	43	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 08:03:23.816
154	43	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 08:03:23.818
155	44	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-25 08:03:50.454
156	45	SYSTEM	CLEAR unit создан как замена для кандидата #54917-20251025-110320960-683024	{"purpose": "replacement_for_candidate", "sourceUnitId": 44, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "54917-20251025-110320960-683024"}	2025-10-25 08:04:12.621
157	44	IN_REQUEST	Создана одиночная заявка, цена: 6.96	{"pricePerUnit": 6.96, "clearReplacementUnitId": 45}	2025-10-25 08:04:12.633
158	44	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 08:04:14.082
159	44	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 08:04:14.084
160	44	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 08:04:14.086
161	46	SYSTEM	Unit автоматически создан из продукта Набор экстракторов 5пр. FORCE 63005B	\N	2025-10-25 08:07:51.617
162	46	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-25 08:08:03.672
163	47	SYSTEM	CLEAR unit создан как замена для кандидата #63005B-20251025-110751615-162873	{"purpose": "replacement_for_candidate", "sourceUnitId": 46, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "63005B-20251025-110751615-162873"}	2025-10-25 08:08:42.071
164	46	IN_REQUEST	Создана одиночная заявка, цена: 23.04	{"pricePerUnit": 23.04, "clearReplacementUnitId": 47}	2025-10-25 08:08:42.083
165	46	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 08:08:44.076
166	46	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 08:08:44.078
167	46	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 08:08:44.081
168	48	SYSTEM	Unit автоматически создан из продукта Набор экстракторов для извлечения обломанных болтов 6пр	\N	2025-10-25 08:10:12.442
169	48	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-25 08:10:24.408
170	49	SYSTEM	CLEAR unit создан как замена для кандидата #YT0590-20251025-111012441-510525	{"purpose": "replacement_for_candidate", "sourceUnitId": 48, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "YT0590-20251025-111012441-510525"}	2025-10-25 08:10:56.134
171	48	IN_REQUEST	Создана одиночная заявка, цена: 11.88	{"pricePerUnit": 11.88, "clearReplacementUnitId": 49}	2025-10-25 08:10:56.147
172	48	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 08:10:58.85
173	48	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 08:10:58.853
174	48	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 08:10:58.855
175	50	SYSTEM	Unit автоматически создан из продукта Головка шестигранная 17мм 1/2"	\N	2025-10-25 08:16:10.804
176	50	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-25 08:16:27.564
177	51	SYSTEM	CLEAR unit создан как замена для кандидата #620 017-20251025-111610803-811809	{"purpose": "replacement_for_candidate", "sourceUnitId": 50, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "620 017-20251025-111610803-811809"}	2025-10-25 08:17:18.626
178	50	SPROUTED	Unit преобразован в SPROUTED для создания 8 дочерних заявок	{"pricePerUnit": 2.16, "childrenCount": 8}	2025-10-25 08:17:18.633
179	52	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 8, "sequence": 1, "parentUnitId": 50}	2025-10-25 08:17:18.635
180	53	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 8, "sequence": 2, "parentUnitId": 50}	2025-10-25 08:17:18.639
181	54	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 8, "sequence": 3, "parentUnitId": 50}	2025-10-25 08:17:18.642
182	55	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 8, "sequence": 4, "parentUnitId": 50}	2025-10-25 08:17:18.645
183	56	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 8, "sequence": 5, "parentUnitId": 50}	2025-10-25 08:17:18.648
184	57	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 8, "sequence": 6, "parentUnitId": 50}	2025-10-25 08:17:18.651
185	58	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 8, "sequence": 7, "parentUnitId": 50}	2025-10-25 08:17:18.654
186	59	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 8, "sequence": 8, "parentUnitId": 50}	2025-10-25 08:17:18.657
187	59	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 08:17:35.479
188	59	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 08:17:35.482
189	59	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 08:17:35.484
190	58	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 08:17:36.149
191	58	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 08:17:36.151
192	58	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 08:17:36.153
193	57	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 08:17:37.284
194	57	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 08:17:37.286
195	57	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 08:17:37.288
196	56	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 08:17:37.987
197	56	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 08:17:37.989
198	56	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 08:17:37.991
199	55	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 08:17:38.69
200	55	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 08:17:38.692
201	55	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 08:17:38.694
202	54	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 08:17:39.453
203	54	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 08:17:39.455
204	54	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 08:17:39.457
205	53	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 08:17:41.143
206	53	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 08:17:41.145
207	53	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 08:17:41.147
208	52	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 08:17:41.793
209	52	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 08:17:41.795
210	52	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 08:17:41.797
211	60	SYSTEM	Unit автоматически создан из продукта Головка 17 мм 6-гранная 1/2DR короткая FORCE 54517	\N	2025-10-25 08:20:01.238
212	60	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-25 08:20:14.638
213	61	SYSTEM	CLEAR unit создан как замена для кандидата #54517-20251025-112001236-388502	{"purpose": "replacement_for_candidate", "sourceUnitId": 60, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "54517-20251025-112001236-388502"}	2025-10-25 08:20:52.449
214	60	SPROUTED	Unit преобразован в SPROUTED для создания 4 дочерних заявок	{"pricePerUnit": 5.82, "childrenCount": 4}	2025-10-25 08:20:52.456
215	62	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 4, "sequence": 1, "parentUnitId": 60}	2025-10-25 08:20:52.459
216	63	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 4, "sequence": 2, "parentUnitId": 60}	2025-10-25 08:20:52.463
217	64	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 4, "sequence": 3, "parentUnitId": 60}	2025-10-25 08:20:52.467
218	65	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 4, "sequence": 4, "parentUnitId": 60}	2025-10-25 08:20:52.47
219	65	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 08:21:07.473
220	65	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 08:21:07.475
221	65	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 08:21:07.477
222	64	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 08:21:08.095
223	64	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 08:21:08.097
224	64	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 08:21:08.099
225	63	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 08:21:08.819
226	63	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 08:21:08.821
227	63	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 08:21:08.823
228	62	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 08:21:09.534
229	62	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 08:21:09.536
230	62	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 08:21:09.538
231	66	SYSTEM	Unit автоматически создан из продукта Головка 1/2" 17мм 6гр.TOPTUL	\N	2025-10-25 08:25:34.405
232	66	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-25 08:25:53.555
233	67	SYSTEM	CLEAR unit создан как замена для кандидата #BAEA1617-20251025-112534403-186662	{"purpose": "replacement_for_candidate", "sourceUnitId": 66, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "BAEA1617-20251025-112534403-186662"}	2025-10-25 08:26:20.171
234	66	IN_REQUEST	Создана одиночная заявка, цена: 3.22	{"pricePerUnit": 3.22, "clearReplacementUnitId": 67}	2025-10-25 08:26:20.176
235	66	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 08:26:25.129
236	66	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 08:26:25.132
237	66	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 08:26:25.134
238	68	SYSTEM	Unit автоматически создан из продукта Головка-бита Philips PH.2 1/4'' FORCE 321322	\N	2025-10-25 08:46:57.621
239	69	SYSTEM	Unit автоматически создан из продукта Головка-бита Slotted 1.2x6.5 мм. 1/4” FORCE 32332065	\N	2025-10-25 08:47:07.998
240	68	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-25 08:47:28.891
241	69	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-25 08:47:29.757
242	70	SYSTEM	CLEAR unit создан как замена для кандидата #321322-20251025-114657620-048311	{"purpose": "replacement_for_candidate", "sourceUnitId": 68, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "321322-20251025-114657620-048311"}	2025-10-25 08:48:30.127
243	68	SPROUTED	Unit преобразован в SPROUTED для создания 7 дочерних заявок	{"pricePerUnit": 2.16, "childrenCount": 7}	2025-10-25 08:48:30.133
244	71	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 7, "sequence": 1, "parentUnitId": 68}	2025-10-25 08:48:30.136
245	72	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 7, "sequence": 2, "parentUnitId": 68}	2025-10-25 08:48:30.139
246	73	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 7, "sequence": 3, "parentUnitId": 68}	2025-10-25 08:48:30.142
247	74	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 7, "sequence": 4, "parentUnitId": 68}	2025-10-25 08:48:30.145
248	75	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 7, "sequence": 5, "parentUnitId": 68}	2025-10-25 08:48:30.148
249	76	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 7, "sequence": 6, "parentUnitId": 68}	2025-10-25 08:48:30.151
250	77	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 7, "sequence": 7, "parentUnitId": 68}	2025-10-25 08:48:30.154
251	78	SYSTEM	CLEAR unit создан как замена для кандидата #32332065-20251025-114707997-084641	{"purpose": "replacement_for_candidate", "sourceUnitId": 69, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "32332065-20251025-114707997-084641"}	2025-10-25 08:49:53.094
252	69	SPROUTED	Unit преобразован в SPROUTED для создания 4 дочерних заявок	{"pricePerUnit": 2.16, "childrenCount": 4}	2025-10-25 08:49:53.103
253	79	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 4, "sequence": 1, "parentUnitId": 69}	2025-10-25 08:49:53.105
254	80	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 4, "sequence": 2, "parentUnitId": 69}	2025-10-25 08:49:53.108
255	81	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 4, "sequence": 3, "parentUnitId": 69}	2025-10-25 08:49:53.111
256	82	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 4, "sequence": 4, "parentUnitId": 69}	2025-10-25 08:49:53.114
257	71	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 08:50:03.846
258	71	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 08:50:03.849
259	71	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 08:50:03.851
260	72	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 08:50:04.636
261	72	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 08:50:04.638
262	72	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 08:50:04.64
263	73	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 08:50:05.806
264	73	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 08:50:05.808
265	73	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 08:50:05.81
266	74	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 08:50:06.697
267	74	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 08:50:06.699
268	74	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 08:50:06.701
269	75	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 08:50:07.27
270	75	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 08:50:07.272
271	75	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 08:50:07.274
272	76	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 08:50:07.876
273	76	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 08:50:07.878
274	76	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 08:50:07.88
275	77	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 08:50:08.748
276	77	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 08:50:08.75
277	77	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 08:50:08.752
278	79	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 08:50:10.397
279	79	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 08:50:10.399
280	79	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 08:50:10.401
281	80	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 08:50:11.032
282	80	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 08:50:11.034
283	80	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 08:50:11.036
284	81	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 08:50:12.147
285	81	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 08:50:12.149
286	81	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 08:50:12.151
287	82	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 08:50:12.666
288	82	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 08:50:12.668
289	82	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 08:50:12.67
290	83	SYSTEM	Unit автоматически создан из продукта Головка 8мм (6гр.), 1/4''	\N	2025-10-25 08:51:24.684
291	83	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-25 08:51:48.118
292	84	SYSTEM	CLEAR unit создан как замена для кандидата #rf52508-20251025-115124682-299232	{"purpose": "replacement_for_candidate", "sourceUnitId": 83, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "rf52508-20251025-115124682-299232"}	2025-10-25 08:52:18.414
293	83	SPROUTED	Unit преобразован в SPROUTED для создания 5 дочерних заявок	{"pricePerUnit": 1, "childrenCount": 5}	2025-10-25 08:52:18.421
294	85	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 1, "parentUnitId": 83}	2025-10-25 08:52:18.423
295	86	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 2, "parentUnitId": 83}	2025-10-25 08:52:18.427
296	87	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 3, "parentUnitId": 83}	2025-10-25 08:52:18.43
297	88	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 4, "parentUnitId": 83}	2025-10-25 08:52:18.433
298	89	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 5, "parentUnitId": 83}	2025-10-25 08:52:18.436
299	85	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 08:52:28.156
300	85	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 08:52:28.158
301	85	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 08:52:28.161
302	86	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 08:52:28.669
303	86	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 08:52:28.671
304	86	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 08:52:28.674
305	87	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 08:52:29.803
306	87	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 08:52:29.805
307	87	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 08:52:29.807
308	88	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 08:52:30.57
309	88	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 08:52:30.572
310	88	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 08:52:30.574
311	89	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 08:52:31.194
312	89	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 08:52:31.196
313	89	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 08:52:31.198
314	89	SALE	Товар продан за 3 ₽	{"isCredit": false, "buyerName": "", "salePrice": 3, "buyerPhone": ""}	2025-10-25 08:54:12.565
315	77	SALE	Товар продан за 4 ₽	{"isCredit": false, "buyerName": "", "salePrice": 4, "buyerPhone": ""}	2025-10-25 08:54:32.95
316	90	SYSTEM	Unit автоматически создан из продукта Головка ударная глубокая 10мм (6гр.), 1/2''	\N	2025-10-25 08:59:32.298
317	90	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-25 08:59:44.115
318	91	SYSTEM	CLEAR unit создан как замена для кандидата #JCB-4458510-20251025-115932295-135816	{"purpose": "replacement_for_candidate", "sourceUnitId": 90, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "JCB-4458510-20251025-115932295-135816"}	2025-10-25 09:00:07.191
319	90	IN_REQUEST	Создана одиночная заявка, цена: 8	{"pricePerUnit": 8, "clearReplacementUnitId": 91}	2025-10-25 09:00:07.204
320	90	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 09:00:10.456
321	90	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 09:00:10.459
322	90	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 09:00:10.462
323	90	SALE	Товар продан за 10 ₽	{"isCredit": false, "buyerName": "", "salePrice": 10, "buyerPhone": ""}	2025-10-25 09:00:31.413
324	92	SYSTEM	Unit автоматически создан из продукта Съёмник пистонов обшивки изогнутый 6мм	\N	2025-10-25 09:20:55.306
325	92	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-25 09:21:24.358
326	93	SYSTEM	CLEAR unit создан как замена для кандидата #825206-20251025-122055305-915811	{"purpose": "replacement_for_candidate", "sourceUnitId": 92, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "825206-20251025-122055305-915811"}	2025-10-25 09:21:49.03
327	92	SPROUTED	Unit преобразован в SPROUTED для создания 5 дочерних заявок	{"pricePerUnit": 5.52, "childrenCount": 5}	2025-10-25 09:21:49.036
328	94	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 1, "parentUnitId": 92}	2025-10-25 09:21:49.04
329	95	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 2, "parentUnitId": 92}	2025-10-25 09:21:49.044
330	96	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 3, "parentUnitId": 92}	2025-10-25 09:21:49.047
331	97	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 4, "parentUnitId": 92}	2025-10-25 09:21:49.051
332	98	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 5, "parentUnitId": 92}	2025-10-25 09:21:49.054
333	94	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 09:22:03.446
334	94	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 09:22:03.448
335	94	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 09:22:03.451
336	95	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 09:22:03.843
337	95	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 09:22:03.845
338	95	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 09:22:03.848
339	96	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 09:22:04.558
340	96	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 09:22:04.561
341	96	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 09:22:04.562
342	96	SALE	Товар продан за 10 ₽	{"isCredit": false, "buyerName": "", "salePrice": 10, "buyerPhone": ""}	2025-10-25 09:22:43.214
343	99	SYSTEM	Unit автоматически создан из продукта Набор приспособлений (пласт.) для демонтажа внутренней обшивки салона 11пр.	\N	2025-10-25 09:26:33.064
344	99	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-25 09:26:44.97
345	100	SYSTEM	CLEAR unit создан как замена для кандидата #FK-905M11-20251025-122633062-026399	{"purpose": "replacement_for_candidate", "sourceUnitId": 99, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "FK-905M11-20251025-122633062-026399"}	2025-10-25 09:27:05.468
346	99	IN_REQUEST	Создана одиночная заявка, цена: 16.2	{"pricePerUnit": 16.2, "clearReplacementUnitId": 100}	2025-10-25 09:27:05.48
347	101	SYSTEM	Unit автоматически создан из продукта Бита TORX T55х75ммL	\N	2025-10-25 09:43:31.431
348	101	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-25 09:44:07.391
349	102	SYSTEM	CLEAR unit создан как замена для кандидата #RF-1767555 Premium-20251025-124331429-970487	{"purpose": "replacement_for_candidate", "sourceUnitId": 101, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "RF-1767555 Premium-20251025-124331429-970487"}	2025-10-25 09:46:45.493
350	101	SPROUTED	Unit преобразован в SPROUTED для создания 5 дочерних заявок	{"pricePerUnit": 2.4, "childrenCount": 5}	2025-10-25 09:46:45.499
351	103	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 1, "parentUnitId": 101}	2025-10-25 09:46:45.502
352	104	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 2, "parentUnitId": 101}	2025-10-25 09:46:45.506
353	105	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 3, "parentUnitId": 101}	2025-10-25 09:46:45.509
354	106	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 4, "parentUnitId": 101}	2025-10-25 09:46:45.513
355	107	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 5, "parentUnitId": 101}	2025-10-25 09:46:45.516
356	103	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 09:46:56.361
357	103	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 09:46:56.364
358	103	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 09:46:56.375
359	104	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 09:46:56.878
360	104	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 09:46:56.88
361	104	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 09:46:56.882
362	105	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 09:46:57.767
363	105	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 09:46:57.769
364	105	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 09:46:57.772
365	106	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 09:46:58.287
366	106	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 09:46:58.29
367	106	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 09:46:58.291
368	107	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 09:46:58.855
369	107	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 09:46:58.857
370	107	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 09:46:58.859
371	107	SALE	Товар продан за 5 ₽	{"isCredit": false, "buyerName": "", "salePrice": 5, "buyerPhone": ""}	2025-10-25 09:47:33.07
372	108	SYSTEM	Unit автоматически создан из продукта Набор головок ударных глубоких 16пр.,1/2''6гр.(10,12-19,21,22,24,27,30,32,36мм), в металлическом кейсе	\N	2025-10-25 09:51:19.21
373	108	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-25 09:51:38.669
374	109	SYSTEM	CLEAR unit создан как замена для кандидата #JCB-4167-5MPB-20251025-125119209-577380	{"purpose": "replacement_for_candidate", "sourceUnitId": 108, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "JCB-4167-5MPB-20251025-125119209-577380"}	2025-10-25 09:52:16.218
375	108	IN_REQUEST	Создана одиночная заявка, цена: 81.36	{"pricePerUnit": 81.36, "clearReplacementUnitId": 109}	2025-10-25 09:52:16.231
376	108	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 09:52:18.127
377	108	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 09:52:18.129
378	108	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 09:52:18.131
379	108	SALE	Товар продан за 120 ₽	{"isCredit": false, "buyerName": "", "salePrice": 120, "buyerPhone": ""}	2025-10-25 09:52:48.136
380	110	SYSTEM	Unit автоматически создан из продукта Головка 10мм (6гр.), 1/4''	\N	2025-10-25 10:33:14.805
381	111	SYSTEM	Unit автоматически создан из продукта Головка 10мм (6гр.), 1/4''	\N	2025-10-25 10:33:43.359
382	111	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-25 10:33:58.979
383	112	SYSTEM	CLEAR unit создан как замена для кандидата #jcb52510-20251025-133343358-369602	{"purpose": "replacement_for_candidate", "sourceUnitId": 111, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "jcb52510-20251025-133343358-369602"}	2025-10-25 10:34:26.399
384	111	IN_REQUEST	Создана одиночная заявка, цена: 1.5	{"pricePerUnit": 1.5, "clearReplacementUnitId": 112}	2025-10-25 10:34:26.412
385	111	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 10:34:28.062
386	111	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 10:34:28.064
387	111	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 10:34:28.066
388	111	SALE	Товар продан за 3 ₽	{"isCredit": false, "buyerName": "", "salePrice": 3, "buyerPhone": ""}	2025-10-25 10:34:47.008
389	88	SALE	Товар продан за 3 ₽	{"isCredit": false, "buyerName": "", "salePrice": 3, "buyerPhone": ""}	2025-10-25 10:34:58.187
390	113	SYSTEM	Unit автоматически создан из продукта Съёмник масляных фильтров ременной Ø60-140 мм	\N	2025-10-25 10:37:32.026
391	113	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-25 10:37:49.16
392	114	SYSTEM	CLEAR unit создан как замена для кандидата #800 410-20251025-133732025-597901	{"purpose": "replacement_for_candidate", "sourceUnitId": 113, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "800 410-20251025-133732025-597901"}	2025-10-25 10:38:18.004
393	113	IN_REQUEST	Создана одиночная заявка, цена: 35.46	{"pricePerUnit": 35.46, "clearReplacementUnitId": 114}	2025-10-25 10:38:18.008
394	113	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 10:38:20.571
395	113	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 10:38:20.573
396	113	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 10:38:20.575
397	113	SALE	Товар продан за 45 ₽	{"isCredit": false, "buyerName": "", "salePrice": 45, "buyerPhone": ""}	2025-10-25 10:38:43.748
398	114	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-25 10:39:29.391
399	115	SYSTEM	CLEAR unit создан как замена для кандидата #800 410-20251025-133818002-310526	{"purpose": "replacement_for_candidate", "sourceUnitId": 114, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "800 410-20251025-133818002-310526"}	2025-10-25 10:39:51.397
400	114	IN_REQUEST	Создана одиночная заявка, цена: 35.46	{"pricePerUnit": 35.46, "clearReplacementUnitId": 115}	2025-10-25 10:39:51.401
401	99	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 10:40:15.316
402	99	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 10:40:15.319
403	99	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 10:40:15.322
404	116	SYSTEM	Unit автоматически создан из продукта Болт к набору для замены сайлентблоков М12	\N	2025-10-25 10:47:23.127
405	116	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-25 10:47:37.746
406	117	SYSTEM	CLEAR unit создан как замена для кандидата #FK-933T1-12P-20251025-134723126-540473	{"purpose": "replacement_for_candidate", "sourceUnitId": 116, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "FK-933T1-12P-20251025-134723126-540473"}	2025-10-25 12:07:49.25
407	116	IN_REQUEST	Создана одиночная заявка, цена: 19.5	{"pricePerUnit": 19.5, "clearReplacementUnitId": 117}	2025-10-25 12:07:49.263
408	116	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 12:07:53.423
409	116	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 12:07:53.425
410	116	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 12:07:53.427
411	116	SALE	Товар продан за 30 ₽	{"isCredit": false, "buyerName": "", "salePrice": 30, "buyerPhone": ""}	2025-10-25 12:08:26.956
412	118	SYSTEM	Unit автоматически создан из продукта Шарнир ударный 1/2"х62мм TOPTUL	\N	2025-10-25 12:11:39.407
413	118	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-25 12:12:04.982
414	119	SYSTEM	CLEAR unit создан как замена для кандидата #KACN160B-20251025-151139405-456655	{"purpose": "replacement_for_candidate", "sourceUnitId": 118, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "KACN160B-20251025-151139405-456655"}	2025-10-25 12:12:36.446
415	118	SPROUTED	Unit преобразован в SPROUTED для создания 2 дочерних заявок	{"pricePerUnit": 21.33, "childrenCount": 2}	2025-10-25 12:12:36.452
416	120	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 1, "parentUnitId": 118}	2025-10-25 12:12:36.454
417	121	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 2, "parentUnitId": 118}	2025-10-25 12:12:36.457
418	120	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 12:13:07.335
419	120	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 12:13:07.337
420	120	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 12:13:07.339
421	121	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 12:13:08.831
422	121	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 12:13:08.833
423	121	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 12:13:08.835
424	121	SALE	Товар продан за 30 ₽	{"isCredit": false, "buyerName": "", "salePrice": 30, "buyerPhone": ""}	2025-10-25 12:13:32.627
425	122	SYSTEM	Unit автоматически создан из продукта Головка разрезная для монтажа кислородного датчика 22 мм ½	\N	2025-10-25 12:16:59.625
426	122	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-25 12:17:15.12
427	123	SYSTEM	CLEAR unit создан как замена для кандидата #40290-20251025-151659623-522743	{"purpose": "replacement_for_candidate", "sourceUnitId": 122, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "40290-20251025-151659623-522743"}	2025-10-25 12:18:03.704
428	122	SPROUTED	Unit преобразован в SPROUTED для создания 4 дочерних заявок	{"pricePerUnit": 12.42, "childrenCount": 4}	2025-10-25 12:18:03.709
429	124	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 4, "sequence": 1, "parentUnitId": 122}	2025-10-25 12:18:03.712
430	125	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 4, "sequence": 2, "parentUnitId": 122}	2025-10-25 12:18:03.715
431	126	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 4, "sequence": 3, "parentUnitId": 122}	2025-10-25 12:18:03.718
432	127	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 4, "sequence": 4, "parentUnitId": 122}	2025-10-25 12:18:03.721
433	124	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 12:18:18.038
434	124	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 12:18:18.04
435	124	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 12:18:18.042
436	127	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 12:18:18.501
437	127	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 12:18:18.503
438	127	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 12:18:18.505
439	125	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 12:18:19.71
440	125	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 12:18:19.712
441	125	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 12:18:19.714
442	127	SALE	Товар продан за 17 ₽	{"isCredit": false, "buyerName": "", "salePrice": 17, "buyerPhone": ""}	2025-10-25 12:18:38.772
443	128	SYSTEM	Unit автоматически создан из продукта Головка двенадцатигранная 19мм 1/2"	\N	2025-10-25 12:21:31.317
444	128	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-25 12:21:55.973
445	129	SYSTEM	CLEAR unit создан как замена для кандидата #622019-20251025-152131315-439503	{"purpose": "replacement_for_candidate", "sourceUnitId": 128, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "622019-20251025-152131315-439503"}	2025-10-25 12:30:45.139
446	128	SPROUTED	Unit преобразован в SPROUTED для создания 4 дочерних заявок	{"pricePerUnit": 2.88, "childrenCount": 4}	2025-10-25 12:30:45.152
447	130	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 4, "sequence": 1, "parentUnitId": 128}	2025-10-25 12:30:45.156
448	131	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 4, "sequence": 2, "parentUnitId": 128}	2025-10-25 12:30:45.16
449	132	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 4, "sequence": 3, "parentUnitId": 128}	2025-10-25 12:30:45.163
450	133	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 4, "sequence": 4, "parentUnitId": 128}	2025-10-25 12:30:45.167
451	133	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 12:30:58.459
452	133	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 12:30:58.461
453	133	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 12:30:58.463
454	132	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 12:30:58.888
455	132	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 12:30:58.891
456	132	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 12:30:58.894
457	131	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 12:31:01.488
458	131	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 12:31:01.49
459	131	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 12:31:01.492
460	130	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 12:31:02.229
461	130	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 12:31:02.231
462	130	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 12:31:02.233
463	132	SALE	Товар продан за 5 ₽	{"isCredit": false, "buyerName": "", "salePrice": 5, "buyerPhone": ""}	2025-10-25 12:31:22.522
464	4	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-25 12:44:48.415
465	134	SYSTEM	CLEAR unit создан как замена для кандидата #622021-20251024-154041595-882958	{"purpose": "replacement_for_candidate", "sourceUnitId": 4, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "622021-20251024-154041595-882958"}	2025-10-25 12:45:35.188
466	4	IN_REQUEST	Создана одиночная заявка, цена: 3.18	{"pricePerUnit": 3.18, "clearReplacementUnitId": 134}	2025-10-25 12:45:35.2
467	4	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 12:45:51.836
468	4	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 12:45:51.839
469	4	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 12:45:51.842
470	4	SALE	Товар продан за 6 ₽	{"isCredit": false, "buyerName": "", "salePrice": 6, "buyerPhone": ""}	2025-10-25 12:46:37.247
471	135	SYSTEM	Unit автоматически создан из продукта Трещотка реверсивная усиленная изогнутая с резиновой ручкой 1/4''(72зуб.)	\N	2025-10-25 12:50:22.088
472	135	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-25 12:50:32.888
473	136	SYSTEM	CLEAR unit создан как замена для кандидата #rf802222-20251025-155022087-196801	{"purpose": "replacement_for_candidate", "sourceUnitId": 135, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "rf802222-20251025-155022087-196801"}	2025-10-25 12:50:52.833
474	135	IN_REQUEST	Создана одиночная заявка, цена: 14	{"pricePerUnit": 14, "clearReplacementUnitId": 136}	2025-10-25 12:50:52.846
475	135	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-25 12:50:55.67
476	135	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-25 12:50:55.672
477	135	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-25 12:50:55.675
478	135	SALE	Товар продан за 20 ₽	{"isCredit": false, "buyerName": "", "salePrice": 20, "buyerPhone": ""}	2025-10-25 12:51:17.988
479	137	SYSTEM	Unit автоматически создан из продукта Набор ключей комбинированных, 16пр.(6-19, 22, 24мм), в пластиковом держателе	\N	2025-10-27 10:48:14.781
480	137	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-27 10:48:35.504
481	138	SYSTEM	CLEAR unit создан как замена для кандидата #F-5161MP-20251027-134814779-918326	{"purpose": "replacement_for_candidate", "sourceUnitId": 137, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "F-5161MP-20251027-134814779-918326"}	2025-10-27 10:49:04.422
1219	369	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-29 09:20:12.373
1252	378	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 09:31:58.242
1262	382	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-29 09:56:30.54
1270	384	SYSTEM	Unit автоматически создан из продукта Шарнир ударный 1/2"х62мм TOPTUL	\N	2025-10-29 10:08:15.235
1274	386	SYSTEM	CLEAR unit создан как замена для кандидата #HZ 25.1.281W-20251029-134355331-387293	{"purpose": "replacement_for_candidate", "sourceUnitId": 385, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "HZ 25.1.281W-20251029-134355331-387293"}	2025-10-29 10:44:24.083
1275	385	IN_REQUEST	Создана одиночная заявка, цена: 16.13	{"pricePerUnit": 16.13, "clearReplacementUnitId": 386}	2025-10-29 10:44:24.091
1281	387	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-29 10:50:21.274
1288	139	SALE	Товар продан за 50 ₽	{"isCredit": false, "buyerName": "", "salePrice": 50, "buyerPhone": ""}	2025-10-29 10:52:53.022
1296	392	SYSTEM	CLEAR unit создан как замена для кандидата #JCB-75510-20251030-105428376-843008	{"purpose": "replacement_for_candidate", "sourceUnitId": 391, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "JCB-75510-20251030-105428376-843008"}	2025-10-30 07:56:10.328
1342	403	SALE	Товар продан за 3.5 ₽	{"isCredit": false, "buyerName": "", "salePrice": 3.5, "buyerPhone": ""}	2025-10-30 07:56:56.641
1343	402	SALE	Товар продан за 3.5 ₽	{"isCredit": false, "buyerName": "", "salePrice": 3.5, "buyerPhone": ""}	2025-10-30 07:57:05.159
1344	404	SYSTEM	Unit автоматически создан из продукта Ключ комбинированный 10мм	\N	2025-10-30 07:58:49.022
1346	405	SYSTEM	CLEAR unit создан как замена для кандидата #JCB-75508-20251030-105849020-999847	{"purpose": "replacement_for_candidate", "sourceUnitId": 404, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "JCB-75508-20251030-105849020-999847"}	2025-10-30 08:06:52.949
1361	409	SYSTEM	Unit автоматически создан из продукта Рукоятка 150 мм 1/4	\N	2025-10-30 08:13:34.192
1362	410	SYSTEM	Unit автоматически создан из продукта Рукоятка для головок 1/4''(6''-150мм)	\N	2025-10-30 08:14:01.612
1363	409	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-30 08:14:29.152
1364	410	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-30 08:14:29.747
1366	409	SPROUTED	Unit преобразован в SPROUTED для создания 2 дочерних заявок	{"pricePerUnit": 4.68, "childrenCount": 2}	2025-10-30 08:15:20.356
1367	412	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 1, "parentUnitId": 409}	2025-10-30 08:15:20.359
1368	413	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 2, "parentUnitId": 409}	2025-10-30 08:15:20.362
1369	412	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-30 08:15:29.568
1370	412	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-30 08:15:29.57
1371	412	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-30 08:15:29.572
1372	413	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-30 08:15:30.364
1373	413	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-30 08:15:30.366
1374	413	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-30 08:15:30.367
1375	414	SYSTEM	CLEAR unit создан как замена для кандидата #RF-8143-20251030-111401610-877281	{"purpose": "replacement_for_candidate", "sourceUnitId": 410, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "RF-8143-20251030-111401610-877281"}	2025-10-30 08:16:10.757
1376	410	SPROUTED	Unit преобразован в SPROUTED для создания 6 дочерних заявок	{"pricePerUnit": 1.74, "childrenCount": 6}	2025-10-30 08:16:10.762
1377	415	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 6, "sequence": 1, "parentUnitId": 410}	2025-10-30 08:16:10.764
1378	416	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 6, "sequence": 2, "parentUnitId": 410}	2025-10-30 08:16:10.766
1379	417	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 6, "sequence": 3, "parentUnitId": 410}	2025-10-30 08:16:10.768
1380	418	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 6, "sequence": 4, "parentUnitId": 410}	2025-10-30 08:16:10.774
1381	419	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 6, "sequence": 5, "parentUnitId": 410}	2025-10-30 08:16:10.776
1382	420	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 6, "sequence": 6, "parentUnitId": 410}	2025-10-30 08:16:10.778
1383	415	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-30 08:16:19.3
1384	415	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-30 08:16:19.301
1385	415	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-30 08:16:19.306
1386	416	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-30 08:16:20.125
1387	416	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-30 08:16:20.126
482	137	SPROUTED	Unit преобразован в SPROUTED для создания 2 дочерних заявок	{"pricePerUnit": 35.58, "childrenCount": 2}	2025-10-27 10:49:04.428
483	139	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 1, "parentUnitId": 137}	2025-10-27 10:49:04.43
484	140	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 2, "parentUnitId": 137}	2025-10-27 10:49:04.434
485	139	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-27 10:49:17.259
486	139	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-27 10:49:17.261
487	139	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-27 10:49:17.264
488	140	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-27 10:49:17.988
489	140	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-27 10:49:17.99
490	140	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-27 10:49:17.992
491	140	SALE	Товар продан за 55 ₽	{"isCredit": false, "buyerName": "", "salePrice": 55, "buyerPhone": ""}	2025-10-27 10:49:44.271
492	141	SYSTEM	Unit автоматически создан из продукта Набор инструментов 108пр.1/4''&1/2''(6-гран)(4-32мм)	\N	2025-10-27 11:11:59.065
493	141	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-27 11:12:18.474
494	142	SYSTEM	CLEAR unit создан как замена для кандидата #JCB-41082-5-20251027-141159063-689910	{"purpose": "replacement_for_candidate", "sourceUnitId": 141, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "JCB-41082-5-20251027-141159063-689910"}	2025-10-27 11:12:41.936
495	141	SPROUTED	Unit преобразован в SPROUTED для создания 2 дочерних заявок	{"pricePerUnit": 105, "childrenCount": 2}	2025-10-27 11:12:41.943
496	143	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 1, "parentUnitId": 141}	2025-10-27 11:12:41.946
497	144	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 2, "parentUnitId": 141}	2025-10-27 11:12:41.95
498	143	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-27 11:12:51.83
499	143	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-27 11:12:51.832
500	143	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-27 11:12:51.834
501	143	SALE	Товар продан за 140 ₽	{"isCredit": false, "buyerName": "", "salePrice": 140, "buyerPhone": ""}	2025-10-27 11:13:09.958
502	145	SYSTEM	Unit автоматически создан из продукта Адаптер-переходник 3/8''(F)x1/2''(M)	\N	2025-10-27 11:17:09.79
503	145	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-27 11:17:20.723
504	146	SYSTEM	CLEAR unit создан как замена для кандидата #80634-20251027-141709789-809795	{"purpose": "replacement_for_candidate", "sourceUnitId": 145, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "80634-20251027-141709789-809795"}	2025-10-27 11:17:53.609
505	145	SPROUTED	Unit преобразован в SPROUTED для создания 11 дочерних заявок	{"pricePerUnit": 5.1, "childrenCount": 11}	2025-10-27 11:17:53.614
506	147	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 1, "parentUnitId": 145}	2025-10-27 11:17:53.618
507	148	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 2, "parentUnitId": 145}	2025-10-27 11:17:53.621
508	149	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 3, "parentUnitId": 145}	2025-10-27 11:17:53.624
509	150	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 4, "parentUnitId": 145}	2025-10-27 11:17:53.627
510	151	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 5, "parentUnitId": 145}	2025-10-27 11:17:53.63
511	152	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 6, "parentUnitId": 145}	2025-10-27 11:17:53.633
512	153	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 7, "parentUnitId": 145}	2025-10-27 11:17:53.636
513	154	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 8, "parentUnitId": 145}	2025-10-27 11:17:53.639
514	155	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 9, "parentUnitId": 145}	2025-10-27 11:17:53.642
515	156	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 10, "parentUnitId": 145}	2025-10-27 11:17:53.644
516	157	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 11, "parentUnitId": 145}	2025-10-27 11:17:53.647
517	147	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-27 11:18:04.509
518	147	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-27 11:18:04.511
519	147	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-27 11:18:04.513
520	147	SALE	Товар продан за 10 ₽	{"isCredit": false, "buyerName": "", "salePrice": 10, "buyerPhone": ""}	2025-10-27 11:18:32.065
521	158	SYSTEM	Unit автоматически создан из продукта Головка ударная 36мм (12гр.), 1/2''	\N	2025-10-27 11:23:09.257
522	158	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-27 11:23:25.706
613	186	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 09:35:08.816
523	159	SYSTEM	CLEAR unit создан как замена для кандидата #FK-44836-20251027-142309255-341198	{"purpose": "replacement_for_candidate", "sourceUnitId": 158, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "FK-44836-20251027-142309255-341198"}	2025-10-27 11:23:55.161
1220	370	SYSTEM	Unit автоматически создан из продукта Метчик M10x1,5 (3шт)	\N	2025-10-29 09:23:22.798
1221	370	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-29 09:23:34.926
1222	371	SYSTEM	CLEAR unit создан как замена для кандидата #Sch-TAP10x1,5-20251029-122322797-994172	{"purpose": "replacement_for_candidate", "sourceUnitId": 370, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "Sch-TAP10x1,5-20251029-122322797-994172"}	2025-10-29 09:23:53.422
1223	370	IN_REQUEST	Создана одиночная заявка, цена: 5.16	{"pricePerUnit": 5.16, "clearReplacementUnitId": 371}	2025-10-29 09:23:53.433
1224	370	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 09:23:56.033
1225	370	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 09:23:56.035
1226	370	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 09:23:56.038
1227	372	SYSTEM	Unit автоматически создан из продукта Метчик ER-01010M M10x1 (2шт),в пластиковом футляре ЭВРИКА /1	\N	2025-10-29 09:25:18.819
1228	372	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-29 09:25:39.854
1230	372	SPROUTED	Unit преобразован в SPROUTED для создания 2 дочерних заявок	{"pricePerUnit": 6.48, "childrenCount": 2}	2025-10-29 09:26:15.59
1231	374	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 1, "parentUnitId": 372}	2025-10-29 09:26:15.592
1232	375	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 2, "parentUnitId": 372}	2025-10-29 09:26:15.595
1233	374	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 09:26:32.639
1234	374	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 09:26:32.641
1235	374	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 09:26:32.644
1236	375	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 09:26:33.549
1237	375	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 09:26:33.551
1238	375	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 09:26:33.553
1253	380	SYSTEM	Unit автоматически создан из продукта Метчик M8x1 (3шт)	\N	2025-10-29 09:32:55.631
1254	380	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-29 09:33:14.891
1255	381	SYSTEM	CLEAR unit создан как замена для кандидата #Sch-TAP8x1-20251029-123255630-324352	{"purpose": "replacement_for_candidate", "sourceUnitId": 380, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "Sch-TAP8x1-20251029-123255630-324352"}	2025-10-29 09:33:45.241
1256	380	IN_REQUEST	Создана одиночная заявка, цена: 4.74	{"pricePerUnit": 4.74, "clearReplacementUnitId": 381}	2025-10-29 09:33:45.253
1257	380	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 09:33:49.644
1258	380	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 09:33:49.647
1259	380	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 09:33:49.649
1263	383	SYSTEM	CLEAR unit создан как замена для кандидата #FK-46510027-20251029-125613507-441653	{"purpose": "replacement_for_candidate", "sourceUnitId": 382, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "FK-46510027-20251029-125613507-441653"}	2025-10-29 09:57:01.768
1264	382	IN_REQUEST	Создана одиночная заявка, цена: 10.92	{"pricePerUnit": 10.92, "clearReplacementUnitId": 383}	2025-10-29 09:57:01.781
1271	120	SALE	Товар продан за 30 ₽	{"isCredit": false, "buyerName": "", "salePrice": 30, "buyerPhone": ""}	2025-10-29 10:11:53.926
1276	385	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 10:44:27.015
1277	385	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 10:44:27.017
1278	385	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 10:44:27.019
1282	388	SYSTEM	CLEAR unit создан как замена для кандидата #628 745-20251029-135011386-012319	{"purpose": "replacement_for_candidate", "sourceUnitId": 387, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "628 745-20251029-135011386-012319"}	2025-10-29 10:51:02.446
1283	387	IN_REQUEST	Создана одиночная заявка, цена: 31	{"pricePerUnit": 31, "clearReplacementUnitId": 388}	2025-10-29 10:51:02.46
1289	166	SALE	Товар продан за 12 ₽	{"isCredit": false, "buyerName": "", "salePrice": 12, "buyerPhone": ""}	2025-10-29 11:07:13.031
1297	391	SPROUTED	Unit преобразован в SPROUTED для создания 11 дочерних заявок	{"pricePerUnit": 1.38, "childrenCount": 11}	2025-10-30 07:56:10.333
1298	393	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 1, "parentUnitId": 391}	2025-10-30 07:56:10.336
1299	394	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 2, "parentUnitId": 391}	2025-10-30 07:56:10.339
1300	395	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 3, "parentUnitId": 391}	2025-10-30 07:56:10.342
1301	396	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 4, "parentUnitId": 391}	2025-10-30 07:56:10.344
524	158	SPROUTED	Unit преобразован в SPROUTED для создания 8 дочерних заявок	{"pricePerUnit": 5.61, "childrenCount": 8}	2025-10-27 11:23:55.176
525	160	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 8, "sequence": 1, "parentUnitId": 158}	2025-10-27 11:23:55.178
526	161	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 8, "sequence": 2, "parentUnitId": 158}	2025-10-27 11:23:55.182
527	162	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 8, "sequence": 3, "parentUnitId": 158}	2025-10-27 11:23:55.185
528	163	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 8, "sequence": 4, "parentUnitId": 158}	2025-10-27 11:23:55.187
529	164	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 8, "sequence": 5, "parentUnitId": 158}	2025-10-27 11:23:55.19
530	165	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 8, "sequence": 6, "parentUnitId": 158}	2025-10-27 11:23:55.193
531	166	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 8, "sequence": 7, "parentUnitId": 158}	2025-10-27 11:23:55.196
532	167	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 8, "sequence": 8, "parentUnitId": 158}	2025-10-27 11:23:55.199
533	160	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-27 11:24:10.321
534	160	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-27 11:24:10.324
535	160	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-27 11:24:10.326
536	161	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-27 11:24:10.878
537	161	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-27 11:24:10.88
538	161	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-27 11:24:10.882
539	162	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-27 11:24:12.253
540	162	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-27 11:24:12.256
541	162	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-27 11:24:12.257
542	163	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-27 11:24:13.116
543	163	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-27 11:24:13.118
544	163	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-27 11:24:13.12
545	164	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-27 11:24:13.786
546	164	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-27 11:24:13.788
547	164	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-27 11:24:13.79
548	165	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-27 11:24:14.366
549	165	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-27 11:24:14.368
550	165	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-27 11:24:14.37
551	166	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-27 11:24:15.264
552	166	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-27 11:24:15.266
553	166	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-27 11:24:15.268
554	167	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-27 11:24:15.769
555	167	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-27 11:24:15.771
556	167	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-27 11:24:15.773
557	167	SALE	Товар продан за 12 ₽	{"isCredit": false, "buyerName": "", "salePrice": 12, "buyerPhone": ""}	2025-10-27 11:24:32.309
558	168	SYSTEM	Unit автоматически создан из продукта Головка ударная шестигранная 19 мм 1/2"	\N	2025-10-27 11:26:36.678
559	168	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-27 11:26:54.189
560	169	SYSTEM	CLEAR unit создан как замена для кандидата #660019-20251027-142636677-868282	{"purpose": "replacement_for_candidate", "sourceUnitId": 168, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "660019-20251027-142636677-868282"}	2025-10-27 11:27:40.349
561	168	SPROUTED	Unit преобразован в SPROUTED для создания 2 дочерних заявок	{"pricePerUnit": 5.16, "childrenCount": 2}	2025-10-27 11:27:40.363
562	170	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 1, "parentUnitId": 168}	2025-10-27 11:27:40.366
563	171	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 2, "parentUnitId": 168}	2025-10-27 11:27:40.369
564	170	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-27 11:27:57.49
565	170	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-27 11:27:57.492
566	170	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-27 11:27:57.494
567	171	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-27 11:27:57.977
568	171	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-27 11:27:57.979
569	171	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-27 11:27:57.981
570	171	SALE	Товар продан за 9 ₽	{"isCredit": false, "buyerName": "", "salePrice": 9, "buyerPhone": ""}	2025-10-27 11:28:40.528
571	172	SYSTEM	Unit автоматически создан из продукта Пистолет продувочный c комплектом сопел ECO ABG-20	\N	2025-10-27 11:31:33.867
572	172	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-27 11:31:44.364
573	173	SYSTEM	CLEAR unit создан как замена для кандидата #ABG-20-20251027-143133863-477235	{"purpose": "replacement_for_candidate", "sourceUnitId": 172, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "ABG-20-20251027-143133863-477235"}	2025-10-27 11:32:00.908
574	172	SPROUTED	Unit преобразован в SPROUTED для создания 5 дочерних заявок	{"pricePerUnit": 11.63, "childrenCount": 5}	2025-10-27 11:32:00.922
575	174	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 1, "parentUnitId": 172}	2025-10-27 11:32:00.925
576	175	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 2, "parentUnitId": 172}	2025-10-27 11:32:00.928
577	176	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 3, "parentUnitId": 172}	2025-10-27 11:32:00.931
578	177	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 4, "parentUnitId": 172}	2025-10-27 11:32:00.934
579	178	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 5, "parentUnitId": 172}	2025-10-27 11:32:00.937
580	174	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-27 11:32:29.268
581	174	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-27 11:32:29.27
582	174	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-27 11:32:29.272
583	174	SALE	Товар продан за 18 ₽	{"isCredit": false, "buyerName": "", "salePrice": 18, "buyerPhone": ""}	2025-10-27 11:32:50.621
584	179	SYSTEM	Unit автоматически создан из продукта Головка свечная 3/8" 14мм L63мм CrV "Yato"	\N	2025-10-28 09:22:15.668
585	179	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-28 09:22:40.255
586	180	SYSTEM	CLEAR unit создан как замена для кандидата #YT-38510-20251028-122215666-534262	{"purpose": "replacement_for_candidate", "sourceUnitId": 179, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "YT-38510-20251028-122215666-534262"}	2025-10-28 09:24:49.533
587	179	SPROUTED	Unit преобразован в SPROUTED для создания 5 дочерних заявок	{"pricePerUnit": 7.08, "childrenCount": 5}	2025-10-28 09:24:49.54
588	181	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 1, "parentUnitId": 179}	2025-10-28 09:24:49.543
589	182	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 2, "parentUnitId": 179}	2025-10-28 09:24:49.547
590	183	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 3, "parentUnitId": 179}	2025-10-28 09:24:49.55
591	184	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 4, "parentUnitId": 179}	2025-10-28 09:24:49.553
592	185	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 5, "parentUnitId": 179}	2025-10-28 09:24:49.556
593	181	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 09:25:00.448
594	181	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 09:25:00.45
595	181	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 09:25:00.452
596	182	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 09:25:01.156
597	182	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 09:25:01.158
598	182	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 09:25:01.16
599	183	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 09:25:02.236
600	183	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 09:25:02.238
601	183	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 09:25:02.24
602	184	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 09:25:02.992
603	184	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 09:25:02.994
604	184	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 09:25:02.996
605	185	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 09:25:03.72
606	185	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 09:25:03.722
607	185	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 09:25:03.724
608	185	SALE	Товар продан за 15 ₽	{"isCredit": false, "buyerName": "", "salePrice": 15, "buyerPhone": ""}	2025-10-28 09:25:45.89
609	186	SYSTEM	Unit автоматически создан из продукта Вороток 3/8" DR Г-образный 250мм на держателе ЭВРИКА	\N	2025-10-28 09:34:07.117
610	186	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-28 09:34:19.33
611	187	SYSTEM	CLEAR unit создан как замена для кандидата #ER-53825-20251028-123407115-650722	{"purpose": "replacement_for_candidate", "sourceUnitId": 186, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "ER-53825-20251028-123407115-650722"}	2025-10-28 09:34:54.866
612	186	IN_REQUEST	Создана одиночная заявка, цена: 7.74	{"pricePerUnit": 7.74, "clearReplacementUnitId": 187}	2025-10-28 09:34:54.871
614	186	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 09:35:08.818
615	186	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 09:35:08.821
616	186	SALE	Товар продан за 10 ₽	{"isCredit": false, "buyerName": "", "salePrice": 10, "buyerPhone": ""}	2025-10-28 09:35:47.796
617	187	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-28 09:36:13.553
618	188	SYSTEM	CLEAR unit создан как замена для кандидата #ER-53825-20251028-123454865-226300	{"purpose": "replacement_for_candidate", "sourceUnitId": 187, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "ER-53825-20251028-123454865-226300"}	2025-10-28 09:36:45.309
619	187	SPROUTED	Unit преобразован в SPROUTED для создания 2 дочерних заявок	{"pricePerUnit": 7.74, "childrenCount": 2}	2025-10-28 09:36:45.345
620	189	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 1, "parentUnitId": 187}	2025-10-28 09:36:45.349
621	190	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 2, "parentUnitId": 187}	2025-10-28 09:36:45.353
622	191	SYSTEM	Unit автоматически создан из продукта Щетка латунированная STARTUL STANDART (ST5025) (проволочная, пластмассовая рукоятка)	\N	2025-10-28 09:40:48.227
623	191	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-28 09:41:02.426
624	192	SYSTEM	CLEAR unit создан как замена для кандидата #ST5025-20251028-124048225-422533	{"purpose": "replacement_for_candidate", "sourceUnitId": 191, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "ST5025-20251028-124048225-422533"}	2025-10-28 09:41:43.716
625	191	SPROUTED	Unit преобразован в SPROUTED для создания 10 дочерних заявок	{"pricePerUnit": 2.64, "childrenCount": 10}	2025-10-28 09:41:43.732
626	193	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 10, "sequence": 1, "parentUnitId": 191}	2025-10-28 09:41:43.735
627	194	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 10, "sequence": 2, "parentUnitId": 191}	2025-10-28 09:41:43.738
628	195	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 10, "sequence": 3, "parentUnitId": 191}	2025-10-28 09:41:43.741
629	196	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 10, "sequence": 4, "parentUnitId": 191}	2025-10-28 09:41:43.744
630	197	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 10, "sequence": 5, "parentUnitId": 191}	2025-10-28 09:41:43.747
631	198	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 10, "sequence": 6, "parentUnitId": 191}	2025-10-28 09:41:43.75
632	199	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 10, "sequence": 7, "parentUnitId": 191}	2025-10-28 09:41:43.753
633	200	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 10, "sequence": 8, "parentUnitId": 191}	2025-10-28 09:41:43.756
634	201	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 10, "sequence": 9, "parentUnitId": 191}	2025-10-28 09:41:43.759
635	202	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 10, "sequence": 10, "parentUnitId": 191}	2025-10-28 09:41:43.763
636	203	SYSTEM	Unit автоматически создан из продукта Щетка ручная по металлу с пластиковой ручкой(L общ-260мм, L раб.-140мм)	\N	2025-10-28 09:46:16.534
637	204	SYSTEM	Unit автоматически создан из продукта Щетка ручная по металлу с пластиковой ручкой(L общ-260мм, L раб.-140мм)	\N	2025-10-28 09:46:20.509
638	203	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-28 09:46:41.117
639	204	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-28 09:46:42.002
640	205	SYSTEM	CLEAR unit создан как замена для кандидата #RF-HB140-20251028-124616533-791625	{"purpose": "replacement_for_candidate", "sourceUnitId": 203, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "RF-HB140-20251028-124616533-791625"}	2025-10-28 09:47:15.513
641	203	IN_REQUEST	Создана одиночная заявка, цена: 1.41	{"pricePerUnit": 1.41, "clearReplacementUnitId": 205}	2025-10-28 09:47:15.528
642	206	SYSTEM	CLEAR unit создан как замена для кандидата #F-HB140-20251028-124620508-896658	{"purpose": "replacement_for_candidate", "sourceUnitId": 204, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "F-HB140-20251028-124620508-896658"}	2025-10-28 09:47:26.99
643	204	SPROUTED	Unit преобразован в SPROUTED для создания 2 дочерних заявок	{"pricePerUnit": 1.08, "childrenCount": 2}	2025-10-28 09:47:27.003
644	207	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 1, "parentUnitId": 204}	2025-10-28 09:47:27.005
645	208	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 2, "parentUnitId": 204}	2025-10-28 09:47:27.009
646	207	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 09:47:40.78
647	207	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 09:47:40.782
648	207	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 09:47:40.785
649	208	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 09:47:41.879
650	208	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 09:47:41.882
651	208	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 09:47:41.884
652	203	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 09:48:04.367
653	203	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 09:48:04.369
654	203	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 09:48:04.371
655	209	SYSTEM	Unit автоматически создан из продукта Щетка по металлу ручная в пластиковом корпусе с прорезиненной рукояткой (металлический скребок-40мм, высокоуглеродистая сталь, 3x19рядов)	\N	2025-10-28 09:54:44.648
656	210	SYSTEM	Unit автоматически создан из продукта Щетка металлическая 6-рядная с пластиковой ручкой (АвтоDело) 44016	\N	2025-10-28 09:54:49.458
657	210	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-28 09:55:28.932
658	209	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-28 09:55:32.901
659	211	SYSTEM	CLEAR unit создан как замена для кандидата #44016-20251028-125449457-911154	{"purpose": "replacement_for_candidate", "sourceUnitId": 210, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "44016-20251028-125449457-911154"}	2025-10-28 09:56:09.817
660	210	SPROUTED	Unit преобразован в SPROUTED для создания 2 дочерних заявок	{"pricePerUnit": 5.52, "childrenCount": 2}	2025-10-28 09:56:09.823
661	212	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 1, "parentUnitId": 210}	2025-10-28 09:56:09.826
662	213	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 2, "parentUnitId": 210}	2025-10-28 09:56:09.83
663	213	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 09:56:32.059
664	213	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 09:56:32.062
665	213	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 09:56:32.064
666	212	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 09:56:33.031
667	212	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 09:56:33.033
668	212	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 09:56:33.035
669	214	SYSTEM	CLEAR unit создан как замена для кандидата #F-340122113-20251028-125444646-691139	{"purpose": "replacement_for_candidate", "sourceUnitId": 209, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "F-340122113-20251028-125444646-691139"}	2025-10-28 09:56:55.34
670	209	SPROUTED	Unit преобразован в SPROUTED для создания 2 дочерних заявок	{"pricePerUnit": 6.93, "childrenCount": 2}	2025-10-28 09:56:55.346
671	215	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 1, "parentUnitId": 209}	2025-10-28 09:56:55.348
672	216	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 2, "parentUnitId": 209}	2025-10-28 09:56:55.351
673	215	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 09:57:05.752
674	215	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 09:57:05.754
675	215	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 09:57:05.757
676	216	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 09:57:06.802
677	216	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 09:57:06.805
678	216	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 09:57:06.807
679	117	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-28 09:58:29.784
680	217	SYSTEM	CLEAR unit создан как замена для кандидата #FK-933T1-12P-20251025-150749248-082852	{"purpose": "replacement_for_candidate", "sourceUnitId": 117, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "FK-933T1-12P-20251025-150749248-082852"}	2025-10-28 09:59:05.277
681	117	SPROUTED	Unit преобразован в SPROUTED для создания 3 дочерних заявок	{"pricePerUnit": 19.5, "childrenCount": 3}	2025-10-28 09:59:05.291
682	218	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 1, "parentUnitId": 117}	2025-10-28 09:59:05.293
683	219	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 2, "parentUnitId": 117}	2025-10-28 09:59:05.296
684	220	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 3, "parentUnitId": 117}	2025-10-28 09:59:05.299
685	218	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 10:00:39.089
686	218	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 10:00:39.091
687	218	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 10:00:39.094
688	220	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 10:00:40.039
689	220	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 10:00:40.041
690	220	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 10:00:40.043
691	219	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 10:00:40.871
692	219	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 10:00:40.873
693	219	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 10:00:40.875
694	220	SALE	Товар продан за 28 ₽	{"isCredit": false, "buyerName": "", "salePrice": 28, "buyerPhone": ""}	2025-10-28 10:01:16.023
695	221	SYSTEM	Unit автоматически создан из продукта Головка свечная 21мм 1/2''(6гр.)	\N	2025-10-28 10:14:46.897
696	221	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-28 10:15:00.922
697	222	SYSTEM	CLEAR unit создан как замена для кандидата #RF-807421-20251028-131446896-922954	{"purpose": "replacement_for_candidate", "sourceUnitId": 221, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "RF-807421-20251028-131446896-922954"}	2025-10-28 10:19:36.372
698	221	SPROUTED	Unit преобразован в SPROUTED для создания 2 дочерних заявок	{"pricePerUnit": 2.25, "childrenCount": 2}	2025-10-28 10:19:36.379
699	223	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 1, "parentUnitId": 221}	2025-10-28 10:19:36.383
700	224	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 2, "parentUnitId": 221}	2025-10-28 10:19:36.387
701	223	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 10:19:52.451
702	223	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 10:19:52.453
703	223	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 10:19:52.456
704	224	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 10:19:53.151
705	224	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 10:19:53.153
706	224	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 10:19:53.155
707	225	SYSTEM	Unit автоматически создан из продукта Насадка TORX T50 75мм LONG TOPTUL	\N	2025-10-28 10:27:13.092
708	225	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-28 10:27:51.141
709	226	SYSTEM	CLEAR unit создан как замена для кандидата #FSEB1250-20251028-132713091-288653	{"purpose": "replacement_for_candidate", "sourceUnitId": 225, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "FSEB1250-20251028-132713091-288653"}	2025-10-28 10:28:16.655
710	225	SPROUTED	Unit преобразован в SPROUTED для создания 5 дочерних заявок	{"pricePerUnit": 3.37, "childrenCount": 5}	2025-10-28 10:28:16.671
711	227	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 1, "parentUnitId": 225}	2025-10-28 10:28:16.674
712	228	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 2, "parentUnitId": 225}	2025-10-28 10:28:16.679
713	229	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 3, "parentUnitId": 225}	2025-10-28 10:28:16.683
714	230	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 4, "parentUnitId": 225}	2025-10-28 10:28:16.687
715	231	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 5, "parentUnitId": 225}	2025-10-28 10:28:16.691
716	232	SYSTEM	Unit автоматически создан из продукта Бита TORX T45х75ммL,10мм	\N	2025-10-28 10:33:01.361
717	233	SYSTEM	Unit автоматически создан из продукта Насадка TORX T45 75мм LONG TOPTUL	\N	2025-10-28 10:33:16.941
718	233	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-28 10:33:50.494
719	232	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-28 10:33:51.085
720	234	SYSTEM	CLEAR unit создан как замена для кандидата #RF-1767545 Premium-20251028-133301360-090572	{"purpose": "replacement_for_candidate", "sourceUnitId": 232, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "RF-1767545 Premium-20251028-133301360-090572"}	2025-10-28 10:34:31.593
721	232	SPROUTED	Unit преобразован в SPROUTED для создания 5 дочерних заявок	{"pricePerUnit": 2, "childrenCount": 5}	2025-10-28 10:34:31.608
722	235	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 1, "parentUnitId": 232}	2025-10-28 10:34:31.611
723	236	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 2, "parentUnitId": 232}	2025-10-28 10:34:31.616
724	237	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 3, "parentUnitId": 232}	2025-10-28 10:34:31.62
725	238	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 4, "parentUnitId": 232}	2025-10-28 10:34:31.624
726	239	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 5, "parentUnitId": 232}	2025-10-28 10:34:31.628
727	240	SYSTEM	CLEAR unit создан как замена для кандидата #FSEB1245-20251028-133316939-655311	{"purpose": "replacement_for_candidate", "sourceUnitId": 233, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "FSEB1245-20251028-133316939-655311"}	2025-10-28 10:34:50.99
728	233	SPROUTED	Unit преобразован в SPROUTED для создания 5 дочерних заявок	{"pricePerUnit": 3.37, "childrenCount": 5}	2025-10-28 10:34:50.994
729	241	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 1, "parentUnitId": 233}	2025-10-28 10:34:50.997
730	242	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 2, "parentUnitId": 233}	2025-10-28 10:34:51
731	243	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 3, "parentUnitId": 233}	2025-10-28 10:34:51.002
781	253	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 10:57:55.629
732	244	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 4, "parentUnitId": 233}	2025-10-28 10:34:51.005
733	245	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 5, "parentUnitId": 233}	2025-10-28 10:34:51.008
734	239	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 10:35:05.569
735	239	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 10:35:05.572
736	239	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 10:35:05.574
737	238	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 10:35:06.152
738	238	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 10:35:06.155
739	238	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 10:35:06.157
740	237	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 10:35:06.869
741	237	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 10:35:06.871
742	237	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 10:35:06.873
743	236	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 10:35:07.416
744	236	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 10:35:07.418
745	236	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 10:35:07.42
746	235	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 10:35:09.247
747	235	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 10:35:09.249
748	235	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 10:35:09.251
749	246	SYSTEM	Unit автоматически создан из продукта Насадка 10мм. L-75мм. TORX T30 FORCE 1767530	\N	2025-10-28 10:45:59.401
750	246	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-28 10:47:01.375
751	247	SYSTEM	CLEAR unit создан как замена для кандидата #1767530-20251028-134559400-973173	{"purpose": "replacement_for_candidate", "sourceUnitId": 246, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "1767530-20251028-134559400-973173"}	2025-10-28 10:47:29.919
752	246	SPROUTED	Unit преобразован в SPROUTED для создания 5 дочерних заявок	{"pricePerUnit": 3.12, "childrenCount": 5}	2025-10-28 10:47:29.933
753	248	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 1, "parentUnitId": 246}	2025-10-28 10:47:29.936
754	249	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 2, "parentUnitId": 246}	2025-10-28 10:47:29.94
755	250	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 3, "parentUnitId": 246}	2025-10-28 10:47:29.943
756	251	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 4, "parentUnitId": 246}	2025-10-28 10:47:29.946
757	252	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 5, "parentUnitId": 246}	2025-10-28 10:47:29.949
758	248	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 10:47:51.465
759	248	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 10:47:51.468
760	248	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 10:47:51.471
761	250	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 10:47:52.008
762	250	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 10:47:52.01
763	250	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 10:47:52.012
764	251	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 10:47:52.578
765	251	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 10:47:52.58
766	251	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 10:47:52.582
767	252	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 10:47:53.17
768	252	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 10:47:53.172
769	252	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 10:47:53.174
770	249	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 10:47:54.13
771	249	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 10:47:54.133
772	249	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 10:47:54.135
773	253	SYSTEM	Unit автоматически создан из продукта Набор бит TORX с отверст. Т10-Т40 7шт. TOPTUL	\N	2025-10-28 10:51:21.094
774	229	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 10:56:28.184
775	229	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 10:56:28.187
776	229	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 10:56:28.19
777	229	SALE	Товар продан за 5 ₽	{"isCredit": false, "buyerName": "", "salePrice": 5, "buyerPhone": ""}	2025-10-28 10:56:45.054
778	253	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-28 10:57:30.966
780	253	IN_REQUEST	Создана одиночная заявка, цена: 6.45	{"pricePerUnit": 6.45, "clearReplacementUnitId": 254}	2025-10-28 10:57:49.562
779	254	SYSTEM	CLEAR unit создан как замена для кандидата #GAAV0703-20251028-135121093-964179	{"purpose": "replacement_for_candidate", "sourceUnitId": 253, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "GAAV0703-20251028-135121093-964179"}	2025-10-28 10:57:49.548
1229	373	SYSTEM	CLEAR unit создан как замена для кандидата #ER01010M-20251029-122518817-925565	{"purpose": "replacement_for_candidate", "sourceUnitId": 372, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "ER01010M-20251029-122518817-925565"}	2025-10-29 09:26:15.576
1260	361	RETURN	Товар возвращен. Причина: Возврат товара	{"returnReason": "Возврат товара", "previousStatus": "SOLD", "previousSalePrice": 30}	2025-10-29 09:41:53.582
1265	382	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 09:57:03.493
1266	382	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 09:57:03.496
1267	382	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 09:57:03.499
1272	385	SYSTEM	Unit автоматически создан из продукта Съемник клемм АКБ и поводков стеклоочистителя Хорекс Авто	\N	2025-10-29 10:43:55.337
1279	385	SALE	Товар продан за 24 ₽	{"isCredit": false, "buyerName": "", "salePrice": 24, "buyerPhone": ""}	2025-10-29 10:48:31.489
1284	387	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 10:51:05.003
1285	387	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 10:51:05.005
1286	387	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 10:51:05.008
1290	389	SYSTEM	Unit автоматически создан из продукта ключ динамометрический! 3/8 5-25нм, 72 зуба, в кейсе\\ R7300381 ARNEZI	\N	2025-10-30 07:47:02.764
1291	389	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-30 07:47:28.742
1292	390	SYSTEM	CLEAR unit создан как замена для кандидата #R7300381-20251030-104702763-940273	{"purpose": "replacement_for_candidate", "sourceUnitId": 389, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "R7300381-20251030-104702763-940273"}	2025-10-30 07:48:00.475
1293	389	IN_REQUEST	Создана одиночная заявка, цена: 71.64	{"pricePerUnit": 71.64, "clearReplacementUnitId": 390}	2025-10-30 07:48:00.489
1302	397	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 5, "parentUnitId": 391}	2025-10-30 07:56:10.346
1303	398	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 6, "parentUnitId": 391}	2025-10-30 07:56:10.349
1304	399	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 7, "parentUnitId": 391}	2025-10-30 07:56:10.351
1305	400	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 8, "parentUnitId": 391}	2025-10-30 07:56:10.353
1306	401	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 9, "parentUnitId": 391}	2025-10-30 07:56:10.355
1307	402	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 10, "parentUnitId": 391}	2025-10-30 07:56:10.357
1308	403	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 11, "parentUnitId": 391}	2025-10-30 07:56:10.359
1309	403	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-30 07:56:26.872
1310	403	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-30 07:56:26.874
1311	403	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-30 07:56:26.876
1312	399	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-30 07:56:27.246
1313	399	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-30 07:56:27.248
1314	399	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-30 07:56:27.25
1315	395	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-30 07:56:28.206
1316	395	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-30 07:56:28.207
1317	395	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-30 07:56:28.209
1318	396	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-30 07:56:29.153
1319	396	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-30 07:56:29.154
1320	396	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-30 07:56:29.155
1321	400	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-30 07:56:29.835
1322	400	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-30 07:56:29.837
1323	400	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-30 07:56:29.838
1324	401	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-30 07:56:30.41
1325	401	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-30 07:56:30.411
1326	401	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-30 07:56:30.413
1327	397	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-30 07:56:31.105
1328	397	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-30 07:56:31.106
1329	397	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-30 07:56:31.108
1330	393	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-30 07:56:31.774
782	253	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 10:57:55.631
783	253	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 10:57:55.633
784	254	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-28 10:57:58.573
785	255	SYSTEM	CLEAR unit создан как замена для кандидата #GAAV0703-20251028-135749546-285789	{"purpose": "replacement_for_candidate", "sourceUnitId": 254, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "GAAV0703-20251028-135749546-285789"}	2025-10-28 10:58:09.162
786	254	IN_REQUEST	Создана одиночная заявка, цена: 6.45	{"pricePerUnit": 6.45, "clearReplacementUnitId": 255}	2025-10-28 10:58:09.175
787	254	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 10:58:13.708
788	254	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 10:58:13.71
789	254	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 10:58:13.712
790	254	SALE	Товар продан за 10 ₽	{"isCredit": false, "buyerName": "", "salePrice": 10, "buyerPhone": ""}	2025-10-28 10:58:26.456
791	219	STATUS_CHANGE	Откат статуса: IN_STORE → IN_REQUEST (возврат в запрос)	{"timestamp": "2025-10-28T11:02:15.353Z", "newCardStatus": "IN_REQUEST", "newProductStatus": null, "previousCardStatus": "ARRIVED", "previousProductStatus": "IN_STORE"}	2025-10-28 11:02:15.354
792	218	STATUS_CHANGE	Откат статуса: IN_STORE → IN_REQUEST (возврат в запрос)	{"timestamp": "2025-10-28T11:02:15.625Z", "newCardStatus": "IN_REQUEST", "newProductStatus": null, "previousCardStatus": "ARRIVED", "previousProductStatus": "IN_STORE"}	2025-10-28 11:02:15.626
793	256	SYSTEM	CLEAR unit создан как замена для кандидата #R7401001-20251025-103413735-302508	{"purpose": "replacement_for_candidate", "sourceUnitId": 34, "sourceLastLog": "CLEAR unit создан как замена для кандидата #R7401001-20251025-103308424-642495", "sourceSerialNumber": "R7401001-20251025-103413735-302508"}	2025-10-28 11:16:11.213
794	34	IN_REQUEST	Создана одиночная заявка, цена: 22.66	{"pricePerUnit": 22.66, "clearReplacementUnitId": 256}	2025-10-28 11:16:11.863
795	34	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 11:16:49.697
796	34	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 11:16:49.7
797	34	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 11:16:49.702
798	257	SYSTEM	Unit автоматически создан из продукта Насадка TORX T45 30мм TOPTUL (Присоединительный размер 10мм)	\N	2025-10-28 12:03:55.912
799	257	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-28 12:04:12.247
800	258	SYSTEM	CLEAR unit создан как замена для кандидата #FSEA1245-20251028-150355910-108974	{"purpose": "replacement_for_candidate", "sourceUnitId": 257, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "FSEA1245-20251028-150355910-108974"}	2025-10-28 12:06:33.969
801	257	SPROUTED	Unit преобразован в SPROUTED для создания 7 дочерних заявок	{"pricePerUnit": 1.6, "childrenCount": 7}	2025-10-28 12:06:33.976
802	259	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 7, "sequence": 1, "parentUnitId": 257}	2025-10-28 12:06:33.979
803	260	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 7, "sequence": 2, "parentUnitId": 257}	2025-10-28 12:06:33.983
804	261	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 7, "sequence": 3, "parentUnitId": 257}	2025-10-28 12:06:33.986
805	262	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 7, "sequence": 4, "parentUnitId": 257}	2025-10-28 12:06:33.989
806	263	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 7, "sequence": 5, "parentUnitId": 257}	2025-10-28 12:06:33.992
807	264	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 7, "sequence": 6, "parentUnitId": 257}	2025-10-28 12:06:33.995
808	265	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 7, "sequence": 7, "parentUnitId": 257}	2025-10-28 12:06:33.998
809	260	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 12:06:44.736
810	260	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 12:06:44.738
811	260	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 12:06:44.74
812	265	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 12:06:45.182
813	265	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 12:06:45.184
814	265	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 12:06:45.186
815	259	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 12:06:47.955
816	259	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 12:06:47.957
817	259	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 12:06:47.959
818	264	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 12:06:49.559
819	264	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 12:06:49.561
820	264	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 12:06:49.563
821	263	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 12:06:50.149
822	263	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 12:06:50.151
823	263	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 12:06:50.153
824	262	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 12:06:50.94
825	262	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 12:06:50.942
826	262	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 12:06:50.944
827	261	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 12:06:51.628
828	261	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 12:06:51.63
829	261	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 12:06:51.632
830	265	SALE	Товар продан за 4 ₽	{"isCredit": false, "buyerName": "", "salePrice": 4, "buyerPhone": ""}	2025-10-28 12:07:14.544
831	241	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 12:07:46.126
832	241	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 12:07:46.128
833	241	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 12:07:46.131
834	241	SALE	Товар продан за 6 ₽	{"isCredit": false, "buyerName": "", "salePrice": 6, "buyerPhone": ""}	2025-10-28 12:08:05.301
835	266	SYSTEM	Unit автоматически создан из продукта Ключ комбинированный 32мм	\N	2025-10-28 12:10:35.701
836	266	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-28 12:10:51.465
837	267	SYSTEM	CLEAR unit создан как замена для кандидата #F-75532-20251028-151035700-078738	{"purpose": "replacement_for_candidate", "sourceUnitId": 266, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "F-75532-20251028-151035700-078738"}	2025-10-28 12:17:58.366
838	266	IN_REQUEST	Создана одиночная заявка, цена: 14.97	{"pricePerUnit": 14.97, "clearReplacementUnitId": 267}	2025-10-28 12:17:58.371
839	266	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 12:28:43.48
840	266	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 12:28:43.483
841	266	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 12:28:43.485
842	266	SALE	Товар продан за 19 ₽	{"isCredit": false, "buyerName": "", "salePrice": 19, "buyerPhone": ""}	2025-10-28 12:29:20.843
843	268	SYSTEM	Unit автоматически создан из продукта Монтировка с рукояткой 11×220мм	\N	2025-10-28 12:34:05.752
844	269	SYSTEM	Unit автоматически создан из продукта Монтировка с рукояткой 20×450мм	\N	2025-10-28 12:34:14.83
845	270	SYSTEM	Unit автоматически создан из продукта Монтировка с рукояткой 20×590мм	\N	2025-10-28 12:34:17.88
846	268	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-28 12:34:55.012
847	269	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-28 12:34:55.434
848	270	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-28 12:34:56.093
849	271	SYSTEM	CLEAR unit создан как замена для кандидата #539 210-20251028-153405751-181240	{"purpose": "replacement_for_candidate", "sourceUnitId": 268, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "539 210-20251028-153405751-181240"}	2025-10-28 12:35:36.001
850	268	IN_REQUEST	Создана одиночная заявка, цена: 5.94	{"pricePerUnit": 5.94, "clearReplacementUnitId": 271}	2025-10-28 12:35:36.013
851	272	SYSTEM	CLEAR unit создан как замена для кандидата #539 240-20251028-153417879-426210	{"purpose": "replacement_for_candidate", "sourceUnitId": 270, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "539 240-20251028-153417879-426210"}	2025-10-28 12:35:56.756
852	270	IN_REQUEST	Создана одиночная заявка, цена: 14.58	{"pricePerUnit": 14.58, "clearReplacementUnitId": 272}	2025-10-28 12:35:56.76
853	273	SYSTEM	CLEAR unit создан как замена для кандидата #539 230-20251028-153414829-965456	{"purpose": "replacement_for_candidate", "sourceUnitId": 269, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "539 230-20251028-153414829-965456"}	2025-10-28 12:36:39.831
854	269	SPROUTED	Unit преобразован в SPROUTED для создания 3 дочерних заявок	{"pricePerUnit": 12.12, "childrenCount": 3}	2025-10-28 12:36:39.837
855	274	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 1, "parentUnitId": 269}	2025-10-28 12:36:39.842
856	275	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 2, "parentUnitId": 269}	2025-10-28 12:36:39.846
857	276	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 3, "parentUnitId": 269}	2025-10-28 12:36:39.849
858	276	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 12:36:49.947
859	276	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 12:36:49.949
860	276	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 12:36:49.951
861	270	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 12:36:50.965
862	270	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 12:36:50.967
863	270	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 12:36:50.969
864	275	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 12:36:52.333
865	275	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 12:36:52.336
866	275	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 12:36:52.338
867	274	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 12:36:53.621
868	274	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 12:36:53.624
869	274	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 12:36:53.626
870	268	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 12:36:54.241
871	268	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 12:36:54.243
872	268	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 12:36:54.245
873	276	SALE	Товар продан за 20 ₽	{"isCredit": false, "buyerName": "", "salePrice": 20, "buyerPhone": ""}	2025-10-28 12:37:37.147
874	277	SYSTEM	Unit автоматически создан из продукта Ключ четырехгранный 10мм	\N	2025-10-28 12:45:21.642
875	278	SYSTEM	Unit автоматически создан из продукта Ключ четырехгранный 8мм	\N	2025-10-28 12:45:25.281
876	277	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-28 12:45:47.737
877	278	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-28 12:45:48.301
878	279	SYSTEM	CLEAR unit создан как замена для кандидата #560 010-20251028-154521638-709603	{"purpose": "replacement_for_candidate", "sourceUnitId": 277, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "560 010-20251028-154521638-709603"}	2025-10-28 12:47:09.307
879	277	IN_REQUEST	Создана одиночная заявка, цена: 4.5	{"pricePerUnit": 4.5, "clearReplacementUnitId": 279}	2025-10-28 12:47:09.32
880	280	SYSTEM	CLEAR unit создан как замена для кандидата #560 008-20251028-154525280-908559	{"purpose": "replacement_for_candidate", "sourceUnitId": 278, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "560 008-20251028-154525280-908559"}	2025-10-28 12:47:25.081
881	278	SPROUTED	Unit преобразован в SPROUTED для создания 8 дочерних заявок	{"pricePerUnit": 2.7, "childrenCount": 8}	2025-10-28 12:47:25.087
882	281	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 8, "sequence": 1, "parentUnitId": 278}	2025-10-28 12:47:25.089
883	282	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 8, "sequence": 2, "parentUnitId": 278}	2025-10-28 12:47:25.092
884	283	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 8, "sequence": 3, "parentUnitId": 278}	2025-10-28 12:47:25.095
885	284	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 8, "sequence": 4, "parentUnitId": 278}	2025-10-28 12:47:25.098
886	285	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 8, "sequence": 5, "parentUnitId": 278}	2025-10-28 12:47:25.101
887	286	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 8, "sequence": 6, "parentUnitId": 278}	2025-10-28 12:47:25.104
888	287	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 8, "sequence": 7, "parentUnitId": 278}	2025-10-28 12:47:25.107
889	288	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 8, "sequence": 8, "parentUnitId": 278}	2025-10-28 12:47:25.11
890	277	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 12:47:34.344
891	277	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 12:47:34.348
892	277	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 12:47:34.351
893	281	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 12:47:35.634
894	281	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 12:47:35.637
895	281	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 12:47:35.639
896	282	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 12:47:36.181
897	282	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 12:47:36.183
898	282	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 12:47:36.185
899	283	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 12:47:37.159
900	283	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 12:47:37.161
901	283	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 12:47:37.164
902	284	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 12:47:37.637
903	284	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 12:47:37.639
904	284	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 12:47:37.641
905	285	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 12:47:38.156
906	285	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 12:47:38.158
907	285	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 12:47:38.16
908	286	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 12:47:38.658
909	286	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 12:47:38.66
910	286	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 12:47:38.662
911	287	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 12:47:39.504
912	287	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 12:47:39.506
913	287	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 12:47:39.508
914	288	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-28 12:47:39.883
915	288	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-28 12:47:39.885
916	288	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-28 12:47:39.887
917	288	SALE	Товар продан за 8 ₽	{"isCredit": false, "buyerName": "", "salePrice": 8, "buyerPhone": ""}	2025-10-28 12:48:02.349
918	14	SALE	Товар продан за 6 ₽	{"isCredit": false, "buyerName": "", "salePrice": 6, "buyerPhone": ""}	2025-10-29 06:15:21.225
919	289	SYSTEM	Unit автоматически создан из продукта ита- сплайн М7 30мм Force 1783007	\N	2025-10-29 06:18:11.361
920	289	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-29 06:18:24.41
921	290	SYSTEM	CLEAR unit создан как замена для кандидата #1783007-20251029-091811360-916175	{"purpose": "replacement_for_candidate", "sourceUnitId": 289, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "1783007-20251029-091811360-916175"}	2025-10-29 06:18:38.496
922	289	IN_REQUEST	Создана одиночная заявка, цена: 2	{"pricePerUnit": 2, "clearReplacementUnitId": 290}	2025-10-29 06:18:38.501
923	289	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 06:18:41.92
924	289	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 06:18:41.922
925	289	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 06:18:41.927
926	289	SALE	Товар продан за 4 ₽	{"isCredit": false, "buyerName": "", "salePrice": 4, "buyerPhone": ""}	2025-10-29 06:19:11.284
927	291	SYSTEM	Unit автоматически создан из продукта Ключ динамометрический 1/4' 5-25 Нм, 72 зуба, в кейсе L=245мм ARNEZI R7300141	\N	2025-10-29 07:29:30.292
928	291	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-29 07:29:48.401
929	292	SYSTEM	CLEAR unit создан как замена для кандидата #R7300141-20251029-102930291-188059	{"purpose": "replacement_for_candidate", "sourceUnitId": 291, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "R7300141-20251029-102930291-188059"}	2025-10-29 07:30:08.892
930	291	SPROUTED	Unit преобразован в SPROUTED для создания 2 дочерних заявок	{"pricePerUnit": 58.44, "childrenCount": 2}	2025-10-29 07:30:08.907
931	293	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 1, "parentUnitId": 291}	2025-10-29 07:30:08.91
932	294	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 2, "parentUnitId": 291}	2025-10-29 07:30:08.914
933	293	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 07:30:17.945
934	293	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 07:30:17.949
935	293	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 07:30:17.951
936	293	SALE	Товар продан за 80 ₽	{"isCredit": false, "buyerName": "", "salePrice": 80, "buyerPhone": ""}	2025-10-29 07:30:33.636
937	295	SYSTEM	Unit автоматически создан из продукта Ключ динамометрический 3/8 10-110 Нм, 72 зуба, в кейсе L=470мм ARNEZI R7300382	\N	2025-10-29 07:34:49.976
938	296	SYSTEM	Unit автоматически создан из продукта Ключ динамометрический 1/2 20-210 Нм, 72 зуба, в кейсе L=490мм ARNEZI R7300121	\N	2025-10-29 07:34:55.688
939	292	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-29 07:35:10.908
940	294	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 07:35:11.684
941	294	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 07:35:11.687
942	294	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 07:35:11.689
943	295	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-29 07:35:29.274
944	296	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-29 07:35:33.707
945	297	SYSTEM	CLEAR unit создан как замена для кандидата #R7300382-20251029-103449975-011329	{"purpose": "replacement_for_candidate", "sourceUnitId": 295, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "R7300382-20251029-103449975-011329"}	2025-10-29 07:36:02.069
946	295	IN_REQUEST	Создана одиночная заявка, цена: 84.54	{"pricePerUnit": 84.54, "clearReplacementUnitId": 297}	2025-10-29 07:36:02.083
947	295	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 07:36:21.014
948	295	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 07:36:21.016
949	295	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 07:36:21.018
950	298	SYSTEM	CLEAR unit создан как замена для кандидата #R7300121-20251029-103455686-358346	{"purpose": "replacement_for_candidate", "sourceUnitId": 296, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "R7300121-20251029-103455686-358346"}	2025-10-29 07:36:32.172
951	296	IN_REQUEST	Создана одиночная заявка, цена: 98.82	{"pricePerUnit": 98.82, "clearReplacementUnitId": 298}	2025-10-29 07:36:32.176
952	296	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 07:36:49.073
953	296	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 07:36:49.075
954	296	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 07:36:49.077
955	299	SYSTEM	Unit автоматически создан из продукта Вороток моментный с трещоточным механизмом 5-25 Hм 1/4" Хорекс Авто HZ 27.1.047W	\N	2025-10-29 07:45:20.596
956	299	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-29 07:45:42.229
957	300	SYSTEM	CLEAR unit создан как замена для кандидата #HZ 27.1.047W-20251029-104520595-671494	{"purpose": "replacement_for_candidate", "sourceUnitId": 299, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "HZ 27.1.047W-20251029-104520595-671494"}	2025-10-29 07:46:03.111
958	299	IN_REQUEST	Создана одиночная заявка, цена: 66.75	{"pricePerUnit": 66.75, "clearReplacementUnitId": 300}	2025-10-29 07:46:03.138
959	299	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 07:46:06.082
960	299	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 07:46:06.084
961	299	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 07:46:06.086
962	301	SYSTEM	Unit автоматически создан из продукта Трещотка 1/4" 36зуб. 131мм TOPTUL	\N	2025-10-29 08:16:14.082
963	301	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-29 08:16:46.751
964	302	SYSTEM	CLEAR unit создан как замена для кандидата #CHAG0813-20251029-111614081-211901	{"purpose": "replacement_for_candidate", "sourceUnitId": 301, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "CHAG0813-20251029-111614081-211901"}	2025-10-29 08:17:58.122
965	301	IN_REQUEST	Создана одиночная заявка, цена: 27.73	{"pricePerUnit": 27.73, "clearReplacementUnitId": 302}	2025-10-29 08:17:58.126
966	301	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 08:18:01.156
967	301	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 08:18:01.159
968	301	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 08:18:01.161
969	136	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-29 08:19:41.115
970	303	SYSTEM	CLEAR unit создан как замена для кандидата #rf802222-20251025-155052831-391411	{"purpose": "replacement_for_candidate", "sourceUnitId": 136, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "rf802222-20251025-155052831-391411"}	2025-10-29 08:20:17.839
971	136	SPROUTED	Unit преобразован в SPROUTED для создания 6 дочерних заявок	{"pricePerUnit": 12, "childrenCount": 6}	2025-10-29 08:20:17.853
972	304	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 6, "sequence": 1, "parentUnitId": 136}	2025-10-29 08:20:17.855
973	305	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 6, "sequence": 2, "parentUnitId": 136}	2025-10-29 08:20:17.858
974	306	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 6, "sequence": 3, "parentUnitId": 136}	2025-10-29 08:20:17.861
975	307	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 6, "sequence": 4, "parentUnitId": 136}	2025-10-29 08:20:17.864
976	308	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 6, "sequence": 5, "parentUnitId": 136}	2025-10-29 08:20:17.867
977	309	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 6, "sequence": 6, "parentUnitId": 136}	2025-10-29 08:20:17.87
978	304	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 08:20:36.788
979	304	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 08:20:36.79
980	304	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 08:20:36.793
981	305	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 08:20:37.761
982	305	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 08:20:37.763
983	305	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 08:20:37.765
984	306	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 08:20:38.59
985	306	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 08:20:38.592
986	306	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 08:20:38.594
987	307	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 08:20:39.118
988	307	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 08:20:39.12
989	307	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 08:20:39.122
990	308	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 08:20:39.677
991	308	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 08:20:39.679
992	308	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 08:20:39.68
993	309	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 08:20:40.554
994	309	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 08:20:40.556
995	309	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 08:20:40.562
996	302	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-29 08:21:23.316
997	310	SYSTEM	CLEAR unit создан как замена для кандидата #CHAG0813-20251029-111758120-696347	{"purpose": "replacement_for_candidate", "sourceUnitId": 302, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "CHAG0813-20251029-111758120-696347"}	2025-10-29 08:21:47.459
998	302	IN_REQUEST	Создана одиночная заявка, цена: 27.73	{"pricePerUnit": 27.73, "clearReplacementUnitId": 310}	2025-10-29 08:21:47.471
999	302	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 08:21:49.259
1000	302	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 08:21:49.261
1001	302	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 08:21:49.263
1002	302	SALE	Товар продан за 40 ₽	{"isCredit": false, "buyerName": "", "salePrice": 40, "buyerPhone": ""}	2025-10-29 08:22:13.243
1003	311	SYSTEM	Unit автоматически создан из продукта Ключ трещоточный 1/4''(72зуб)	\N	2025-10-29 08:24:09.013
1004	311	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-29 08:24:26.833
1005	312	SYSTEM	CLEAR unit создан как замена для кандидата #BM-802222-20251029-112409012-143967	{"purpose": "replacement_for_candidate", "sourceUnitId": 311, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "BM-802222-20251029-112409012-143967"}	2025-10-29 08:24:51.753
1006	311	SPROUTED	Unit преобразован в SPROUTED для создания 2 дочерних заявок	{"pricePerUnit": 13.8, "childrenCount": 2}	2025-10-29 08:24:51.768
1007	313	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 1, "parentUnitId": 311}	2025-10-29 08:24:51.771
1008	314	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 2, "parentUnitId": 311}	2025-10-29 08:24:51.774
1009	313	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 08:25:02.993
1010	313	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 08:25:02.995
1011	313	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 08:25:02.997
1012	314	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 08:25:03.883
1013	314	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 08:25:03.885
1014	314	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 08:25:03.887
1015	315	SYSTEM	Unit автоматически создан из продукта Трещотка 1/4" 36зуб. 150мм TOPTUL	\N	2025-10-29 08:27:01.431
1016	315	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-29 08:27:12.844
1017	316	SYSTEM	CLEAR unit создан как замена для кандидата #CJBG0815-20251029-112701430-916472	{"purpose": "replacement_for_candidate", "sourceUnitId": 315, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "CJBG0815-20251029-112701430-916472"}	2025-10-29 08:27:35.667
1018	315	IN_REQUEST	Создана одиночная заявка, цена: 30.44	{"pricePerUnit": 30.44, "clearReplacementUnitId": 316}	2025-10-29 08:27:35.671
1019	315	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 08:27:37.784
1020	315	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 08:27:37.786
1021	315	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 08:27:37.788
1022	317	SYSTEM	Unit автоматически создан из продукта Трещотка 1/4'' 24 зуб. 155 мм Force 80222	\N	2025-10-29 08:29:55.678
1023	317	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-29 08:30:08.638
1024	318	SYSTEM	CLEAR unit создан как замена для кандидата #80222-20251029-112955677-610382	{"purpose": "replacement_for_candidate", "sourceUnitId": 317, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "80222-20251029-112955677-610382"}	2025-10-29 08:30:21.85
1025	317	IN_REQUEST	Создана одиночная заявка, цена: 43	{"pricePerUnit": 43, "clearReplacementUnitId": 318}	2025-10-29 08:30:21.863
1026	317	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 08:30:23.461
1027	317	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 08:30:23.463
1028	317	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 08:30:23.465
1029	319	SYSTEM	Unit автоматически создан из продукта Метчик M14x1,5 (3шт)	\N	2025-10-29 08:35:01.608
1030	319	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-29 08:35:12.108
1031	320	SYSTEM	CLEAR unit создан как замена для кандидата #Sch-TAP14x1.5-20251029-113501606-937177	{"purpose": "replacement_for_candidate", "sourceUnitId": 319, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "Sch-TAP14x1.5-20251029-113501606-937177"}	2025-10-29 08:35:29.692
1032	319	IN_REQUEST	Создана одиночная заявка, цена: 9.99	{"pricePerUnit": 9.99, "clearReplacementUnitId": 320}	2025-10-29 08:35:29.705
1033	319	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 08:35:31.466
1034	319	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 08:35:31.468
1035	319	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 08:35:31.47
1036	319	SALE	Товар продан за 15 ₽	{"isCredit": false, "buyerName": "", "salePrice": 15, "buyerPhone": ""}	2025-10-29 08:35:51.301
1037	321	SYSTEM	Unit автоматически создан из продукта Клещи переставные ER-13130 универсальные, покрытие черное порошковое 300мм ЭВРИКА 1/36	\N	2025-10-29 08:39:41.925
1038	321	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-29 08:39:54.771
1039	322	SYSTEM	CLEAR unit создан как замена для кандидата #ER13130-20251029-113941923-969559	{"purpose": "replacement_for_candidate", "sourceUnitId": 321, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "ER13130-20251029-113941923-969559"}	2025-10-29 08:40:24.304
1097	337	SALE	Товар продан за 12 ₽	{"isCredit": false, "buyerName": "", "salePrice": 12, "buyerPhone": ""}	2025-10-29 08:56:33.437
1040	321	SPROUTED	Unit преобразован в SPROUTED для создания 2 дочерних заявок	{"pricePerUnit": 18.18, "childrenCount": 2}	2025-10-29 08:40:24.317
1041	323	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 1, "parentUnitId": 321}	2025-10-29 08:40:24.32
1042	324	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 2, "parentUnitId": 321}	2025-10-29 08:40:24.323
1043	323	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 08:40:32.557
1044	323	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 08:40:32.56
1045	323	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 08:40:32.563
1046	324	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 08:40:33.004
1047	324	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 08:40:33.006
1048	324	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 08:40:33.008
1049	324	SALE	Товар продан за 25 ₽	{"isCredit": false, "buyerName": "", "salePrice": 25, "buyerPhone": ""}	2025-10-29 08:40:47.739
1050	325	SYSTEM	Unit автоматически создан из продукта Щётка-мини с прорезиненной рукояткой, щетина из нержавеющей стали	\N	2025-10-29 08:44:05.651
1051	325	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-29 08:44:18.707
1052	326	SYSTEM	CLEAR unit создан как замена для кандидата #270055-20251029-114405650-521796	{"purpose": "replacement_for_candidate", "sourceUnitId": 325, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "270055-20251029-114405650-521796"}	2025-10-29 08:44:32.576
1053	325	SPROUTED	Unit преобразован в SPROUTED для создания 4 дочерних заявок	{"pricePerUnit": 3.54, "childrenCount": 4}	2025-10-29 08:44:32.591
1054	327	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 4, "sequence": 1, "parentUnitId": 325}	2025-10-29 08:44:32.594
1055	328	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 4, "sequence": 2, "parentUnitId": 325}	2025-10-29 08:44:32.597
1056	329	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 4, "sequence": 3, "parentUnitId": 325}	2025-10-29 08:44:32.6
1057	330	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 4, "sequence": 4, "parentUnitId": 325}	2025-10-29 08:44:32.603
1058	329	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 08:44:44.731
1059	329	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 08:44:44.737
1060	329	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 08:44:44.739
1061	330	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 08:44:45.596
1062	330	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 08:44:45.598
1063	330	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 08:44:45.6
1064	327	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 08:44:46.708
1065	327	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 08:44:46.71
1066	327	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 08:44:46.712
1067	328	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 08:44:47.391
1068	328	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 08:44:47.393
1069	328	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 08:44:47.395
1070	330	SALE	Товар продан за 5 ₽	{"isCredit": false, "buyerName": "", "salePrice": 5, "buyerPhone": ""}	2025-10-29 08:45:08.652
1071	331	SYSTEM	Unit автоматически создан из продукта Бита Force 1767545 T45	\N	2025-10-29 08:47:42.627
1072	331	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-29 08:48:12.623
1073	332	SYSTEM	CLEAR unit создан как замена для кандидата #1767545-20251029-114742626-900476	{"purpose": "replacement_for_candidate", "sourceUnitId": 331, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "1767545-20251029-114742626-900476"}	2025-10-29 08:48:39.759
1074	331	IN_REQUEST	Создана одиночная заявка, цена: 3.5	{"pricePerUnit": 3.5, "clearReplacementUnitId": 332}	2025-10-29 08:48:39.77
1075	331	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 08:48:45.474
1076	331	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 08:48:45.477
1077	331	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 08:48:45.479
1078	331	SALE	Товар продан за 5 ₽	{"isCredit": false, "buyerName": "", "salePrice": 5, "buyerPhone": ""}	2025-10-29 08:48:58.492
1079	252	SALE	Товар продан за 5 ₽	{"isCredit": false, "buyerName": "", "salePrice": 5, "buyerPhone": ""}	2025-10-29 08:49:32.225
1080	251	SALE	Товар продан за 5 ₽	{"isCredit": false, "buyerName": "", "salePrice": 5, "buyerPhone": ""}	2025-10-29 08:51:41.397
1081	333	SYSTEM	Unit автоматически создан из продукта Вороток Г-образн. (3/8"; 200*75 mm) АвтоDело	\N	2025-10-29 08:54:56.975
1082	333	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-29 08:55:41.914
1083	334	SYSTEM	CLEAR unit создан как замена для кандидата #39775-20251029-115456974-149224	{"purpose": "replacement_for_candidate", "sourceUnitId": 333, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "39775-20251029-115456974-149224"}	2025-10-29 08:55:57.5
1084	333	SPROUTED	Unit преобразован в SPROUTED для создания 3 дочерних заявок	{"pricePerUnit": 6.72, "childrenCount": 3}	2025-10-29 08:55:57.505
1085	335	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 1, "parentUnitId": 333}	2025-10-29 08:55:57.508
1086	336	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 2, "parentUnitId": 333}	2025-10-29 08:55:57.511
1087	337	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 3, "parentUnitId": 333}	2025-10-29 08:55:57.513
1088	335	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 08:56:11.147
1089	335	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 08:56:11.149
1090	335	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 08:56:11.151
1091	336	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 08:56:11.507
1092	336	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 08:56:11.509
1093	336	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 08:56:11.511
1094	337	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 08:56:12.189
1095	337	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 08:56:12.191
1096	337	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 08:56:12.193
1098	338	SYSTEM	Unit автоматически создан из продукта Щетка для чистки каналов	\N	2025-10-29 08:58:14.192
1099	338	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-29 08:58:53.401
1100	339	SYSTEM	CLEAR unit создан как замена для кандидата #SB31020-20251029-115814191-806356	{"purpose": "replacement_for_candidate", "sourceUnitId": 338, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "SB31020-20251029-115814191-806356"}	2025-10-29 08:59:53.388
1101	338	SPROUTED	Unit преобразован в SPROUTED для создания 21 дочерних заявок	{"pricePerUnit": 2, "childrenCount": 21}	2025-10-29 08:59:53.394
1102	340	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 21, "sequence": 1, "parentUnitId": 338}	2025-10-29 08:59:53.396
1103	341	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 21, "sequence": 2, "parentUnitId": 338}	2025-10-29 08:59:53.399
1104	342	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 21, "sequence": 3, "parentUnitId": 338}	2025-10-29 08:59:53.402
1105	343	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 21, "sequence": 4, "parentUnitId": 338}	2025-10-29 08:59:53.405
1106	344	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 21, "sequence": 5, "parentUnitId": 338}	2025-10-29 08:59:53.407
1107	345	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 21, "sequence": 6, "parentUnitId": 338}	2025-10-29 08:59:53.41
1108	346	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 21, "sequence": 7, "parentUnitId": 338}	2025-10-29 08:59:53.413
1109	347	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 21, "sequence": 8, "parentUnitId": 338}	2025-10-29 08:59:53.415
1110	348	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 21, "sequence": 9, "parentUnitId": 338}	2025-10-29 08:59:53.418
1111	349	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 21, "sequence": 10, "parentUnitId": 338}	2025-10-29 08:59:53.421
1112	350	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 21, "sequence": 11, "parentUnitId": 338}	2025-10-29 08:59:53.424
1113	351	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 21, "sequence": 12, "parentUnitId": 338}	2025-10-29 08:59:53.426
1114	352	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 21, "sequence": 13, "parentUnitId": 338}	2025-10-29 08:59:53.429
1115	353	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 21, "sequence": 14, "parentUnitId": 338}	2025-10-29 08:59:53.432
1116	354	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 21, "sequence": 15, "parentUnitId": 338}	2025-10-29 08:59:53.434
1117	355	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 21, "sequence": 16, "parentUnitId": 338}	2025-10-29 08:59:53.437
1118	356	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 21, "sequence": 17, "parentUnitId": 338}	2025-10-29 08:59:53.44
1119	357	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 21, "sequence": 18, "parentUnitId": 338}	2025-10-29 08:59:53.444
1120	358	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 21, "sequence": 19, "parentUnitId": 338}	2025-10-29 08:59:53.446
1121	359	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 21, "sequence": 20, "parentUnitId": 338}	2025-10-29 08:59:53.449
1122	360	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 21, "sequence": 21, "parentUnitId": 338}	2025-10-29 08:59:53.452
1123	359	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 09:00:02.365
1124	360	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 09:00:02.365
1125	359	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 09:00:02.368
1126	360	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 09:00:02.368
1127	359	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 09:00:02.371
1239	376	SYSTEM	Unit автоматически создан из продукта Метчик M9x1 (3шт)	\N	2025-10-29 09:29:18.019
1240	376	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-29 09:29:29.918
1241	377	SYSTEM	CLEAR unit создан как замена для кандидата #Sch-TAP9x1-20251029-122918018-814974	{"purpose": "replacement_for_candidate", "sourceUnitId": 376, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "Sch-TAP9x1-20251029-122918018-814974"}	2025-10-29 09:29:48.045
1242	376	IN_REQUEST	Создана одиночная заявка, цена: 5.25	{"pricePerUnit": 5.25, "clearReplacementUnitId": 377}	2025-10-29 09:29:48.057
1243	376	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 09:29:49.519
1244	376	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 09:29:49.521
1245	376	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 09:29:49.523
1261	382	SYSTEM	Unit автоматически создан из продукта Головка ударная глубокая 27мм (6гр.), 3/4''	\N	2025-10-29 09:56:13.513
1268	382	SALE	Товар продан за 18 ₽	{"isCredit": false, "buyerName": "", "salePrice": 18, "buyerPhone": ""}	2025-10-29 09:57:26.181
1269	34	SALE	Товар продан за 30 ₽	{"isCredit": false, "buyerName": "", "salePrice": 30, "buyerPhone": ""}	2025-10-29 09:57:58.428
1273	385	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-29 10:44:10.761
1280	387	SYSTEM	Unit автоматически создан из продукта Трещотка 45 зубцов 1/2"	\N	2025-10-29 10:50:11.387
1287	387	SALE	Товар продан за 40 ₽	{"isCredit": false, "buyerName": "", "salePrice": 40, "buyerPhone": ""}	2025-10-29 10:51:22.975
1294	391	SYSTEM	Unit автоматически создан из продукта Ключ комбинированный 10мм	\N	2025-10-30 07:54:28.377
1295	391	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-30 07:54:53.02
1331	393	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-30 07:56:31.775
1332	393	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-30 07:56:31.777
1333	394	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-30 07:56:32.379
1334	394	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-30 07:56:32.38
1335	394	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-30 07:56:32.382
1336	398	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-30 07:56:33.043
1337	398	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-30 07:56:33.044
1338	398	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-30 07:56:33.046
1339	402	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-30 07:56:33.867
1340	402	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-30 07:56:33.869
1341	402	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-30 07:56:33.87
1345	404	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-30 08:05:51.462
1347	404	SPROUTED	Unit преобразован в SPROUTED для создания 3 дочерних заявок	{"pricePerUnit": 1.08, "childrenCount": 3}	2025-10-30 08:06:52.964
1348	406	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 1, "parentUnitId": 404}	2025-10-30 08:06:52.967
1349	407	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 2, "parentUnitId": 404}	2025-10-30 08:06:52.97
1350	408	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 3, "parentUnitId": 404}	2025-10-30 08:06:52.973
1351	407	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-30 08:07:22.416
1352	407	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-30 08:07:22.418
1353	407	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-30 08:07:22.42
1354	406	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-30 08:07:22.917
1355	406	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-30 08:07:22.919
1356	406	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-30 08:07:22.921
1357	408	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-30 08:07:23.785
1358	408	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-30 08:07:23.788
1359	408	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-30 08:07:23.789
1360	408	SALE	Товар продан за 3 ₽	{"isCredit": false, "buyerName": "", "salePrice": 3, "buyerPhone": ""}	2025-10-30 08:07:48.399
1365	411	SYSTEM	CLEAR unit создан как замена для кандидата #608815-20251030-111334191-406815	{"purpose": "replacement_for_candidate", "sourceUnitId": 409, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "608815-20251030-111334191-406815"}	2025-10-30 08:15:20.343
1388	416	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-30 08:16:20.127
1389	417	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-30 08:16:20.986
1390	417	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-30 08:16:20.988
1391	417	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-30 08:16:20.989
1128	360	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 09:00:02.371
1129	358	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 09:00:02.833
1130	358	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 09:00:02.835
1131	358	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 09:00:02.837
1132	357	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 09:00:03.909
1133	357	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 09:00:03.911
1134	357	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 09:00:03.914
1135	356	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 09:00:04.44
1136	356	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 09:00:04.442
1137	356	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 09:00:04.444
1138	355	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 09:00:05.054
1139	355	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 09:00:05.056
1140	355	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 09:00:05.058
1141	348	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 09:00:05.655
1142	348	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 09:00:05.657
1143	348	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 09:00:05.658
1144	347	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 09:00:07.13
1145	347	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 09:00:07.133
1146	347	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 09:00:07.135
1147	346	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 09:00:07.607
1148	346	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 09:00:07.609
1149	346	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 09:00:07.611
1150	345	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 09:00:08.136
1151	345	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 09:00:08.138
1152	345	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 09:00:08.14
1153	341	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 09:00:08.991
1154	341	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 09:00:08.993
1155	341	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 09:00:08.995
1156	340	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 09:00:12.643
1157	340	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 09:00:12.645
1158	340	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 09:00:12.646
1159	344	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 09:00:15.136
1160	344	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 09:00:15.138
1161	344	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 09:00:15.14
1162	353	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 09:00:16.383
1163	353	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 09:00:16.385
1164	353	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 09:00:16.387
1165	354	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 09:00:16.871
1166	354	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 09:00:16.873
1167	354	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 09:00:16.875
1168	342	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 09:00:17.41
1169	342	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 09:00:17.412
1170	342	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 09:00:17.414
1171	343	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 09:00:18.265
1172	343	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 09:00:18.267
1173	343	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 09:00:18.269
1174	352	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 09:00:19.499
1175	352	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 09:00:19.501
1176	352	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 09:00:19.503
1177	351	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 09:00:20.207
1178	351	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 09:00:20.209
1179	351	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 09:00:20.211
1180	350	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 09:00:20.89
1181	350	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 09:00:20.892
1182	350	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 09:00:20.898
1183	349	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 09:00:21.444
1184	349	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 09:00:21.446
1185	349	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 09:00:21.448
1186	360	SALE	Товар продан за 5 ₽	{"isCredit": false, "buyerName": "", "salePrice": 5, "buyerPhone": ""}	2025-10-29 09:00:40.001
1187	361	SYSTEM	Unit автоматически создан из продукта Съемник рулевых тяг универсальный 27-42мм, 1/2''	\N	2025-10-29 09:03:14.99
1188	361	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-29 09:03:35.356
1189	362	SYSTEM	CLEAR unit создан как замена для кандидата #RF-9T0801-20251029-120314988-684712	{"purpose": "replacement_for_candidate", "sourceUnitId": 361, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "RF-9T0801-20251029-120314988-684712"}	2025-10-29 09:03:56.652
1190	361	IN_REQUEST	Создана одиночная заявка, цена: 21.6	{"pricePerUnit": 21.6, "clearReplacementUnitId": 362}	2025-10-29 09:03:56.663
1191	361	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 09:03:58.02
1192	361	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 09:03:58.022
1193	361	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 09:03:58.024
1194	361	SALE	Товар продан за 30 ₽	{"isCredit": false, "buyerName": "", "salePrice": 30, "buyerPhone": ""}	2025-10-29 09:04:14.255
1195	294	STATUS_CHANGE	Откат статуса: IN_STORE → IN_REQUEST (возврат в запрос)	{"timestamp": "2025-10-29T09:07:06.556Z", "newCardStatus": "IN_REQUEST", "newProductStatus": null, "previousCardStatus": "ARRIVED", "previousProductStatus": "IN_STORE"}	2025-10-29 09:07:06.557
1196	363	SYSTEM	Unit автоматически создан из продукта Трещотка 45 зубцов 1/4"	\N	2025-10-29 09:09:46.889
1197	363	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-29 09:10:03.919
1198	364	SYSTEM	CLEAR unit создан как замена для кандидата #608 745-20251029-120946888-063984	{"purpose": "replacement_for_candidate", "sourceUnitId": 363, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "608 745-20251029-120946888-063984"}	2025-10-29 09:10:58.577
1199	363	SPROUTED	Unit преобразован в SPROUTED для создания 3 дочерних заявок	{"pricePerUnit": 18.12, "childrenCount": 3}	2025-10-29 09:10:58.583
1200	365	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 1, "parentUnitId": 363}	2025-10-29 09:10:58.586
1201	366	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 2, "parentUnitId": 363}	2025-10-29 09:10:58.589
1202	367	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 3, "parentUnitId": 363}	2025-10-29 09:10:58.592
1203	365	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 09:11:10.727
1204	365	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 09:11:10.73
1205	365	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 09:11:10.732
1206	366	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 09:11:11.66
1207	366	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 09:11:11.662
1208	366	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 09:11:11.664
1209	367	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 09:11:13.384
1210	367	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 09:11:13.386
1211	367	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 09:11:13.388
1212	368	SYSTEM	Unit автоматически создан из продукта Метчик M12x1,75 (3шт)	\N	2025-10-29 09:17:33.031
1213	368	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-29 09:17:59.434
1214	369	SYSTEM	CLEAR unit создан как замена для кандидата #Sch-TAP12x1.75-20251029-121733030-228595	{"purpose": "replacement_for_candidate", "sourceUnitId": 368, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "Sch-TAP12x1.75-20251029-121733030-228595"}	2025-10-29 09:18:23.984
1215	368	IN_REQUEST	Создана одиночная заявка, цена: 6.51	{"pricePerUnit": 6.51, "clearReplacementUnitId": 369}	2025-10-29 09:18:23.995
1216	368	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 09:18:55.377
1217	368	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 09:18:55.379
1218	368	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-29 09:18:55.382
1246	378	SYSTEM	Unit автоматически создан из продукта Метчик M8x1,25 (3шт)	\N	2025-10-29 09:31:18.269
1247	378	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-29 09:31:31.285
1248	379	SYSTEM	CLEAR unit создан как замена для кандидата #Sch-TAP8x1,25-20251029-123118267-102060	{"purpose": "replacement_for_candidate", "sourceUnitId": 378, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "Sch-TAP8x1,25-20251029-123118267-102060"}	2025-10-29 09:31:56.619
1249	378	IN_REQUEST	Создана одиночная заявка, цена: 4.29	{"pricePerUnit": 4.29, "clearReplacementUnitId": 379}	2025-10-29 09:31:56.632
1250	378	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-29 09:31:58.238
1251	378	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-29 09:31:58.24
1392	418	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-30 08:16:21.505
1393	418	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-30 08:16:21.507
1394	418	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-30 08:16:21.508
1395	419	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-30 08:16:22.113
1396	419	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-30 08:16:22.115
1397	419	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-30 08:16:22.116
1398	420	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-30 08:16:22.609
1399	420	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-30 08:16:22.611
1400	420	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-30 08:16:22.612
1401	408	RETURN	Товар возвращен. Причина: Возврат товара	{"returnReason": "Возврат товара", "previousStatus": "SOLD", "previousSalePrice": 3}	2025-10-30 08:25:45.661
1402	408	SALE	Товар продан за 3 ₽	{"isCredit": false, "buyerName": "", "salePrice": 3, "buyerPhone": ""}	2025-10-30 08:31:38.503
1403	420	SALE	Товар продан за 5 ₽	{"isCredit": false, "buyerName": "", "salePrice": 5, "buyerPhone": ""}	2025-10-30 08:32:06.003
1404	421	SYSTEM	Unit автоматически создан из продукта Головка шестигранная 7 мм 1/4"	\N	2025-10-30 08:33:56.122
1405	421	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-30 08:34:16.523
1406	422	SYSTEM	CLEAR unit создан как замена для кандидата #600 057-20251030-113356120-396444	{"purpose": "replacement_for_candidate", "sourceUnitId": 421, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "600 057-20251030-113356120-396444"}	2025-10-30 08:35:39.295
1407	421	SPROUTED	Unit преобразован в SPROUTED для создания 2 дочерних заявок	{"pricePerUnit": 1.74, "childrenCount": 2}	2025-10-30 08:35:39.339
1408	423	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 1, "parentUnitId": 421}	2025-10-30 08:35:39.344
1409	424	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 2, "parentUnitId": 421}	2025-10-30 08:35:39.347
1410	423	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-30 08:35:57.465
1411	423	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-30 08:35:57.467
1412	423	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-30 08:35:57.47
1413	424	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-30 08:35:58.033
1414	424	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-30 08:35:58.034
1415	424	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-30 08:35:58.036
1416	424	SALE	Товар продан за 2 ₽	{"isCredit": false, "buyerName": "", "salePrice": 2, "buyerPhone": ""}	2025-10-30 08:36:11.937
1417	425	SYSTEM	Unit автоматически создан из продукта Головка 1/4" 7мм 6гр.TOPTUL	\N	2025-10-30 08:37:58.666
1418	425	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-30 08:38:46.016
1419	426	SYSTEM	CLEAR unit создан как замена для кандидата #BAEA0807-20251030-113758664-111563	{"purpose": "replacement_for_candidate", "sourceUnitId": 425, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "BAEA0807-20251030-113758664-111563"}	2025-10-30 08:39:32.388
1420	425	SPROUTED	Unit преобразован в SPROUTED для создания 5 дочерних заявок	{"pricePerUnit": 0.92, "childrenCount": 5}	2025-10-30 08:39:32.403
1421	427	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 1, "parentUnitId": 425}	2025-10-30 08:39:32.406
1422	428	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 2, "parentUnitId": 425}	2025-10-30 08:39:32.409
1423	429	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 3, "parentUnitId": 425}	2025-10-30 08:39:32.412
1424	430	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 4, "parentUnitId": 425}	2025-10-30 08:39:32.415
1425	431	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 5, "parentUnitId": 425}	2025-10-30 08:39:32.417
1426	157	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-30 08:40:12.868
1427	157	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-30 08:40:12.87
1428	157	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-30 08:40:12.872
1429	156	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-30 08:40:13.382
1430	156	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-30 08:40:13.383
1431	156	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-30 08:40:13.385
1432	155	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-30 08:40:14.071
1433	155	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-30 08:40:14.073
1434	155	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-30 08:40:14.074
1435	154	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-30 08:40:14.691
1436	154	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-30 08:40:14.693
1528	144	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 10:22:31.71
1437	154	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-30 08:40:14.694
1438	153	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-30 08:40:17.247
1439	153	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-30 08:40:17.249
1440	153	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-30 08:40:17.25
1441	126	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-30 08:41:10.955
1442	126	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-30 08:41:10.957
1443	126	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-30 08:41:10.958
1444	123	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-30 08:41:19.208
1445	432	SYSTEM	CLEAR unit создан как замена для кандидата #40290-20251025-151803702-967255	{"purpose": "replacement_for_candidate", "sourceUnitId": 123, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "40290-20251025-151803702-967255"}	2025-10-30 08:41:49.512
1446	123	IN_REQUEST	Создана одиночная заявка, цена: 12.42	{"pricePerUnit": 12.42, "clearReplacementUnitId": 432}	2025-10-30 08:41:49.524
1447	123	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-30 08:41:50.786
1448	123	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-30 08:41:50.788
1449	123	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-30 08:41:50.789
1450	114	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-30 08:42:27.463
1451	114	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-30 08:42:27.465
1452	114	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-30 08:42:27.467
1453	97	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-30 08:44:12.64
1454	97	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-30 08:44:12.642
1455	97	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-30 08:44:12.644
1456	98	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-30 08:44:13.36
1457	98	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-30 08:44:13.361
1458	98	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-30 08:44:13.363
1459	433	SYSTEM	Unit автоматически создан из продукта Зубило для пневмомолотка по листовому металлу 178мм TOPTUL	\N	2025-10-30 09:42:34.796
1460	433	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-30 09:42:57.378
1461	434	SYSTEM	CLEAR unit создан как замена для кандидата #KAJA18C1-20251030-124234795-477958	{"purpose": "replacement_for_candidate", "sourceUnitId": 433, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "KAJA18C1-20251030-124234795-477958"}	2025-10-30 09:43:20.281
1462	433	IN_REQUEST	Создана одиночная заявка, цена: 14.65	{"pricePerUnit": 14.65, "clearReplacementUnitId": 434}	2025-10-30 09:43:20.292
1463	433	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-30 09:43:22.432
1464	433	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-30 09:43:22.434
1465	433	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-30 09:43:22.436
1466	433	SALE	Товар продан за 19 ₽	{"isCredit": false, "buyerName": "", "salePrice": 19, "buyerPhone": ""}	2025-10-30 09:43:43.035
1467	435	SYSTEM	Unit автоматически создан из продукта Адаптер для головок 1/2''(F)х1/4''(M) L36 мм Force	\N	2025-10-30 09:52:41.887
1468	435	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-30 09:52:54.804
1469	436	SYSTEM	CLEAR unit создан как замена для кандидата #80942-20251030-125241885-936934	{"purpose": "replacement_for_candidate", "sourceUnitId": 435, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "80942-20251030-125241885-936934"}	2025-10-30 09:53:30.311
1470	435	SPROUTED	Unit преобразован в SPROUTED для создания 3 дочерних заявок	{"pricePerUnit": 6.96, "childrenCount": 3}	2025-10-30 09:53:30.325
1471	437	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 1, "parentUnitId": 435}	2025-10-30 09:53:30.327
1472	438	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 2, "parentUnitId": 435}	2025-10-30 09:53:30.329
1473	439	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 3, "parentUnitId": 435}	2025-10-30 09:53:30.331
1474	439	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-30 09:53:42.685
1475	439	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-30 09:53:42.686
1476	439	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-30 09:53:42.688
1477	437	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-30 09:53:43.284
1478	437	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-30 09:53:43.286
1479	437	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-30 09:53:43.287
1480	438	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-30 09:53:44.083
1481	438	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-30 09:53:44.084
1482	438	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-30 09:53:44.086
1483	439	SALE	Товар продан за 12 ₽	{"isCredit": false, "buyerName": "", "salePrice": 12, "buyerPhone": ""}	2025-10-30 09:54:04.349
1484	440	SYSTEM	Unit автоматически создан из продукта Головка TORX E8 1/4"	\N	2025-10-30 10:02:25.601
1485	440	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-30 10:02:54.256
1486	441	SYSTEM	CLEAR unit создан как замена для кандидата #603 008-20251030-130225600-648027	{"purpose": "replacement_for_candidate", "sourceUnitId": 440, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "603 008-20251030-130225600-648027"}	2025-10-30 10:03:35.385
1487	440	SPROUTED	Unit преобразован в SPROUTED для создания 5 дочерних заявок	{"pricePerUnit": 1.08, "childrenCount": 5}	2025-10-30 10:03:35.391
1488	442	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 1, "parentUnitId": 440}	2025-10-30 10:03:35.393
1489	443	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 2, "parentUnitId": 440}	2025-10-30 10:03:35.396
1490	444	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 3, "parentUnitId": 440}	2025-10-30 10:03:35.399
1491	445	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 4, "parentUnitId": 440}	2025-10-30 10:03:35.401
1492	446	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 5, "parentUnitId": 440}	2025-10-30 10:03:35.403
1493	442	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-30 10:03:48.37
1494	442	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-30 10:03:48.372
1495	442	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-30 10:03:48.374
1496	443	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-30 10:03:48.555
1497	443	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-30 10:03:48.557
1498	443	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-30 10:03:48.559
1499	444	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-30 10:03:49.613
1500	444	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-30 10:03:49.615
1501	444	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-30 10:03:49.616
1502	445	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-30 10:03:49.905
1503	445	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-30 10:03:49.907
1504	445	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-30 10:03:49.909
1505	446	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-30 10:03:50.23
1506	446	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-30 10:03:50.232
1507	446	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-30 10:03:50.233
1508	446	SALE	Товар продан за 4 ₽	{"isCredit": false, "buyerName": "", "salePrice": 4, "buyerPhone": ""}	2025-10-30 10:04:28.969
1509	445	SALE	Товар продан за 4 ₽	{"isCredit": false, "buyerName": "", "salePrice": 4, "buyerPhone": ""}	2025-10-30 10:04:36.786
1510	447	SYSTEM	Unit автоматически создан из продукта Гайколом 16-22мм	\N	2025-10-30 10:08:38.212
1511	448	SYSTEM	Unit автоматически создан из продукта Гайколом 12-16мм	\N	2025-10-30 10:08:38.334
1512	447	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-30 10:08:52.119
1513	448	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-30 10:08:52.55
1514	449	SYSTEM	CLEAR unit создан как замена для кандидата #839 822-20251030-130838211-197743	{"purpose": "replacement_for_candidate", "sourceUnitId": 447, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "839 822-20251030-130838211-197743"}	2025-10-30 10:09:13.607
1515	447	IN_REQUEST	Создана одиночная заявка, цена: 25.74	{"pricePerUnit": 25.74, "clearReplacementUnitId": 449}	2025-10-30 10:09:13.619
1516	447	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-30 10:09:16.929
1517	447	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-30 10:09:16.931
1518	447	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-30 10:09:16.933
1519	450	SYSTEM	CLEAR unit создан как замена для кандидата #839 816-20251030-130838332-684591	{"purpose": "replacement_for_candidate", "sourceUnitId": 448, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "839 816-20251030-130838332-684591"}	2025-10-30 10:09:27.805
1520	448	IN_REQUEST	Создана одиночная заявка, цена: 15	{"pricePerUnit": 15, "clearReplacementUnitId": 450}	2025-10-30 10:09:27.816
1521	448	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-30 10:09:29.147
1522	448	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-30 10:09:29.148
1523	448	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-30 10:09:29.15
1524	448	SALE	Товар продан за 20 ₽	{"isCredit": false, "buyerName": "", "salePrice": 20, "buyerPhone": ""}	2025-10-30 10:11:02.544
1525	447	SALE	Товар продан за 32 ₽	{"isCredit": false, "buyerName": "", "salePrice": 32, "buyerPhone": ""}	2025-10-30 10:11:19.589
1526	309	SALE	Товар продан за 15 ₽	{"isCredit": false, "buyerName": "", "salePrice": 15, "buyerPhone": ""}	2025-10-31 07:12:56.125
1527	308	SALE	Товар продан за 12 ₽	{"isCredit": false, "buyerName": "", "salePrice": 12, "buyerPhone": ""}	2025-10-31 07:13:09.972
1529	144	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 10:22:31.723
1530	144	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 10:22:31.725
1531	148	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 10:22:35.727
1532	148	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 10:22:35.729
1533	148	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 10:22:35.731
1534	149	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 10:22:37.82
1535	149	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 10:22:37.822
1536	149	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 10:22:37.823
1537	150	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 10:22:39.792
1538	150	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 10:22:39.793
1539	150	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 10:22:39.794
1540	151	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 10:22:41.81
1541	151	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 10:22:41.812
1542	151	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 10:22:41.813
1543	152	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 10:22:43.456
1544	152	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 10:22:43.458
1545	152	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 10:22:43.459
1546	175	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 10:22:46.672
1547	175	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 10:22:46.674
1548	175	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 10:22:46.675
1549	176	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 10:22:50.622
1550	176	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 10:22:50.623
1551	176	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 10:22:50.625
1552	193	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 10:22:58.204
1553	193	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 10:22:58.205
1554	193	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 10:22:58.207
1555	194	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 10:23:00.574
1556	194	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 10:23:00.576
1557	194	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 10:23:00.577
1558	195	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 10:23:02.054
1559	195	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 10:23:02.055
1560	195	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 10:23:02.056
1561	196	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 10:23:03.52
1562	196	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 10:23:03.521
1563	196	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 10:23:03.523
1564	197	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 10:23:05.359
1565	197	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 10:23:05.36
1566	197	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 10:23:05.362
1567	198	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 10:23:06.769
1568	198	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 10:23:06.77
1569	198	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 10:23:06.772
1570	199	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 10:23:08.494
1571	199	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 10:23:08.496
1572	199	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 10:23:08.497
1573	200	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 10:23:09.948
1574	200	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 10:23:09.95
1575	200	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 10:23:09.951
1576	201	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 10:23:11.52
1577	201	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 10:23:11.521
1578	201	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 10:23:11.522
1579	202	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 10:23:12.817
1580	202	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 10:23:12.819
1581	202	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 10:23:12.82
1582	218	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 10:23:19.455
1583	218	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 10:23:19.456
1584	218	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 10:23:19.458
1585	219	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 10:23:21.264
1586	219	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 10:23:21.265
1587	219	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 10:23:21.266
1588	227	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 10:23:23.954
1589	227	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 10:23:23.955
1590	227	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 10:23:23.957
1591	228	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 10:23:25.638
1592	228	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 10:23:25.64
1593	228	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 10:23:25.642
1594	230	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 10:23:27.214
1595	230	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 10:23:27.215
1596	230	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 10:23:27.217
1597	231	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 10:23:28.959
1598	231	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 10:23:28.96
1599	231	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 10:23:28.962
1600	242	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 10:23:30.833
1601	242	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 10:23:30.835
1602	242	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 10:23:30.836
1603	243	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 10:23:32.425
1604	243	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 10:23:32.427
1605	243	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 10:23:32.428
1606	244	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 10:23:33.948
1607	244	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 10:23:33.949
1608	244	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 10:23:33.951
1609	245	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 10:23:35.573
1610	245	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 10:23:35.575
1611	245	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 10:23:35.576
1612	294	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 10:23:38.689
1613	294	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 10:23:38.691
1614	294	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 10:23:38.692
1615	427	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 10:23:43.662
1616	427	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 10:23:43.664
1617	427	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 10:23:43.665
1618	428	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 10:23:46.005
1619	428	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 10:23:46.007
1620	428	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 10:23:46.008
1621	429	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 10:23:49
1622	429	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 10:23:49.002
1623	429	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 10:23:49.003
1624	430	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 10:24:17.958
1625	430	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 10:24:17.959
1626	430	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 10:24:17.961
1627	431	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 10:24:21.576
1628	431	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 10:24:21.578
1629	431	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 10:24:21.579
1630	451	SYSTEM	Unit автоматически создан из продукта Приспособление для притирки клапанов механическое (для электрической дрели), 6 предметов ("АвтоDело") (40574)	\N	2025-11-02 10:33:31.503
1631	451	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-11-02 10:33:49.991
1632	452	SYSTEM	CLEAR unit создан как замена для кандидата #40574-20251102-133331501-211320	{"purpose": "replacement_for_candidate", "sourceUnitId": 451, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "40574-20251102-133331501-211320"}	2025-11-02 10:34:30.097
1633	451	SPROUTED	Unit преобразован в SPROUTED для создания 2 дочерних заявок	{"pricePerUnit": 33.12, "childrenCount": 2}	2025-11-02 10:34:30.104
1634	453	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 1, "parentUnitId": 451}	2025-11-02 10:34:30.106
1635	454	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 2, "parentUnitId": 451}	2025-11-02 10:34:30.108
1636	453	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 10:34:50.614
1637	453	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 10:34:50.616
1638	453	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 10:34:50.617
1639	454	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 10:34:51.552
1640	454	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 10:34:51.554
1641	454	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 10:34:51.555
1642	455	SYSTEM	Unit автоматически создан из продукта Ключ Г-образный 6-гранный 13мм	\N	2025-11-02 10:40:55.107
1643	455	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-11-02 10:41:11.093
1644	456	SYSTEM	CLEAR unit создан как замена для кандидата #JCB-76413-20251102-134055104-471057	{"purpose": "replacement_for_candidate", "sourceUnitId": 455, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "JCB-76413-20251102-134055104-471057"}	2025-11-02 10:42:03.021
1645	455	SPROUTED	Unit преобразован в SPROUTED для создания 2 дочерних заявок	{"pricePerUnit": 8.7, "childrenCount": 2}	2025-11-02 10:42:03.034
1646	457	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 1, "parentUnitId": 455}	2025-11-02 10:42:03.036
1647	458	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 2, "parentUnitId": 455}	2025-11-02 10:42:03.039
1648	457	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 10:42:12.151
1649	457	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 10:42:12.153
1650	457	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 10:42:12.155
1651	458	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 10:42:12.707
1652	458	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 10:42:12.709
1653	458	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 10:42:12.71
1654	458	SALE	Товар продан за 10 ₽	{"isCredit": false, "buyerName": "", "salePrice": 10, "buyerPhone": ""}	2025-11-02 10:42:37.548
1655	457	STATUS_CHANGE	Откат статуса: IN_STORE → IN_REQUEST (возврат в запрос)	{"timestamp": "2025-11-02T10:42:56.599Z", "newCardStatus": "IN_REQUEST", "newProductStatus": null, "previousCardStatus": "ARRIVED", "previousProductStatus": "IN_STORE"}	2025-11-02 10:42:56.6
1656	459	SYSTEM	Unit автоматически создан из продукта Ключ Г-образный 6-гранный 16мм	\N	2025-11-02 10:44:15.373
1657	459	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-11-02 10:44:29.393
1658	460	SYSTEM	CLEAR unit создан как замена для кандидата #JCB-76416-20251102-134415372-427222	{"purpose": "replacement_for_candidate", "sourceUnitId": 459, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "JCB-76416-20251102-134415372-427222"}	2025-11-02 10:45:14.258
1659	459	IN_REQUEST	Создана одиночная заявка, цена: 8.7	{"pricePerUnit": 8.7, "clearReplacementUnitId": 460}	2025-11-02 10:45:14.27
1660	459	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 10:45:18.053
1661	459	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 10:45:18.054
1662	459	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 10:45:18.056
1663	461	SYSTEM	Unit автоматически создан из продукта Ключ Г-образный 6-гранный 17мм	\N	2025-11-02 10:49:11.644
1664	462	SYSTEM	Unit автоматически создан из продукта Ключ Г-образный 6-гранный 18мм	\N	2025-11-02 10:49:16.383
1665	463	SYSTEM	Unit автоматически создан из продукта Ключ Г-образный 6-гранный 19мм	\N	2025-11-02 10:49:20.918
1666	461	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-11-02 10:49:36.976
1667	463	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-11-02 10:49:38.281
1668	462	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-11-02 10:49:40.681
1669	464	SYSTEM	CLEAR unit создан как замена для кандидата #JCB-76419-20251102-134920916-510952	{"purpose": "replacement_for_candidate", "sourceUnitId": 463, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "JCB-76419-20251102-134920916-510952"}	2025-11-02 10:50:40.329
1670	463	SPROUTED	Unit преобразован в SPROUTED для создания 2 дочерних заявок	{"pricePerUnit": 11.7, "childrenCount": 2}	2025-11-02 10:50:40.355
1671	465	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 1, "parentUnitId": 463}	2025-11-02 10:50:40.358
1672	466	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 2, "parentUnitId": 463}	2025-11-02 10:50:40.361
1673	467	SYSTEM	CLEAR unit создан как замена для кандидата #JCB-76418-20251102-134916382-777437	{"purpose": "replacement_for_candidate", "sourceUnitId": 462, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "JCB-76418-20251102-134916382-777437"}	2025-11-02 10:51:20.545
1674	462	IN_REQUEST	Создана одиночная заявка, цена: 11.7	{"pricePerUnit": 11.7, "clearReplacementUnitId": 467}	2025-11-02 10:51:20.548
1675	462	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 10:51:31.201
1676	462	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 10:51:31.203
1677	462	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 10:51:31.204
1678	465	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 10:51:33.184
1679	465	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 10:51:33.185
1680	465	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 10:51:33.187
1681	466	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 10:51:34.017
1682	466	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 10:51:34.019
1683	466	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 10:51:34.02
1684	468	SYSTEM	CLEAR unit создан как замена для кандидата #JCB-76417-20251102-134911643-212798	{"purpose": "replacement_for_candidate", "sourceUnitId": 461, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "JCB-76417-20251102-134911643-212798"}	2025-11-02 10:51:54.074
1685	461	IN_REQUEST	Создана одиночная заявка, цена: 8.34	{"pricePerUnit": 8.34, "clearReplacementUnitId": 468}	2025-11-02 10:51:54.085
1686	7	SALE	Товар продан за 35 ₽	{"isCredit": false, "buyerName": "", "salePrice": 35, "buyerPhone": ""}	2025-11-02 10:53:35.807
1687	469	SYSTEM	Unit автоматически создан из продукта Зубило с шестигранным основанием 16мм (L-175мм),на пластиковом держателе	\N	2025-11-02 10:55:52.919
1688	469	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-11-02 10:56:03.609
1689	470	SYSTEM	CLEAR unit создан как замена для кандидата #RF-60316175-20251102-135552917-177977	{"purpose": "replacement_for_candidate", "sourceUnitId": 469, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "RF-60316175-20251102-135552917-177977"}	2025-11-02 10:56:34.754
1690	469	SPROUTED	Unit преобразован в SPROUTED для создания 2 дочерних заявок	{"pricePerUnit": 6.75, "childrenCount": 2}	2025-11-02 10:56:34.766
1691	471	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 1, "parentUnitId": 469}	2025-11-02 10:56:34.768
1692	472	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 2, "parentUnitId": 469}	2025-11-02 10:56:34.771
1693	471	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 10:56:41.754
1694	471	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 10:56:41.755
1695	471	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 10:56:41.757
1696	472	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 10:56:42.56
1697	472	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 10:56:42.562
1698	472	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 10:56:42.563
1699	472	SALE	Товар продан за 7 ₽	{"isCredit": false, "buyerName": "", "salePrice": 7, "buyerPhone": ""}	2025-11-02 10:57:02.586
1700	473	SYSTEM	Unit автоматически создан из продукта Переходник ударный 3/4"F × 1/2"M	\N	2025-11-02 11:01:20.668
1701	473	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-11-02 11:01:39.267
1702	474	SYSTEM	CLEAR unit создан как замена для кандидата #669 450-20251102-140120666-537683	{"purpose": "replacement_for_candidate", "sourceUnitId": 473, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "669 450-20251102-140120666-537683"}	2025-11-02 11:04:55.469
1703	473	SPROUTED	Unit преобразован в SPROUTED для создания 3 дочерних заявок	{"pricePerUnit": 15.36, "childrenCount": 3}	2025-11-02 11:04:55.475
1704	475	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 1, "parentUnitId": 473}	2025-11-02 11:04:55.478
1705	476	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 2, "parentUnitId": 473}	2025-11-02 11:04:55.481
1706	477	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 3, "parentUnitId": 473}	2025-11-02 11:04:55.483
1707	475	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 11:05:11.842
1708	475	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 11:05:11.844
1709	475	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 11:05:11.845
1710	476	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 11:05:12.431
1711	476	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 11:05:12.432
1712	476	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 11:05:12.434
1713	477	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 11:05:15.418
1714	477	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 11:05:15.42
1715	477	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 11:05:15.421
1716	475	STATUS_CHANGE	Откат статуса: IN_STORE → IN_REQUEST (возврат в запрос)	{"timestamp": "2025-11-02T11:05:20.351Z", "newCardStatus": "IN_REQUEST", "newProductStatus": null, "previousCardStatus": "ARRIVED", "previousProductStatus": "IN_STORE"}	2025-11-02 11:05:20.352
1758	494	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 5, "parentUnitId": 488}	2025-11-02 11:33:12.976
1717	476	STATUS_CHANGE	Откат статуса: IN_STORE → IN_REQUEST (возврат в запрос)	{"timestamp": "2025-11-02T11:05:21.087Z", "newCardStatus": "IN_REQUEST", "newProductStatus": null, "previousCardStatus": "ARRIVED", "previousProductStatus": "IN_STORE"}	2025-11-02 11:05:21.087
1718	478	SYSTEM	Unit автоматически создан из продукта Вороток Г-образный двухсторонний ударный CR-Mo 450мм 3/4''	\N	2025-11-02 11:16:24.539
1719	478	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-11-02 11:16:37.931
1720	479	SYSTEM	CLEAR unit создан как замена для кандидата #F-8156450MPB-20251102-141624537-097751	{"purpose": "replacement_for_candidate", "sourceUnitId": 478, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "F-8156450MPB-20251102-141624537-097751"}	2025-11-02 11:17:22.197
1721	478	SPROUTED	Unit преобразован в SPROUTED для создания 3 дочерних заявок	{"pricePerUnit": 22.95, "childrenCount": 3}	2025-11-02 11:17:22.212
1722	480	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 1, "parentUnitId": 478}	2025-11-02 11:17:22.214
1723	481	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 2, "parentUnitId": 478}	2025-11-02 11:17:22.217
1724	482	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 3, "parentUnitId": 478}	2025-11-02 11:17:22.219
1725	480	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 11:17:29.939
1726	480	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 11:17:29.941
1727	480	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 11:17:29.942
1728	481	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 11:17:30.454
1729	481	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 11:17:30.455
1730	481	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 11:17:30.457
1731	482	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 11:17:31.314
1732	482	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 11:17:31.316
1733	482	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 11:17:31.317
1734	482	SALE	Товар продан за 30 ₽	{"isCredit": false, "buyerName": "", "salePrice": 30, "buyerPhone": ""}	2025-11-02 11:17:44.518
1735	170	SALE	Товар продан за 12 ₽	{"isCredit": false, "buyerName": "", "salePrice": 12, "buyerPhone": ""}	2025-11-02 11:19:57.66
1736	483	SYSTEM	Unit автоматически создан из продукта Подставка ремонтная 3т (h min 285мм, h max 420мм) (к-т 2шт.)	\N	2025-11-02 11:23:34.899
1737	483	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-11-02 11:23:45.284
1738	484	SYSTEM	CLEAR unit создан как замена для кандидата #F-T43001C ST-20251102-142334897-834752	{"purpose": "replacement_for_candidate", "sourceUnitId": 483, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "F-T43001C ST-20251102-142334897-834752"}	2025-11-02 11:23:57.657
1739	483	SPROUTED	Unit преобразован в SPROUTED для создания 2 дочерних заявок	{"pricePerUnit": 84, "childrenCount": 2}	2025-11-02 11:23:57.671
1740	485	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 1, "parentUnitId": 483}	2025-11-02 11:23:57.674
1741	486	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 2, "parentUnitId": 483}	2025-11-02 11:23:57.677
1742	485	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 11:24:04.182
1743	485	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 11:24:04.184
1744	485	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 11:24:04.185
1745	486	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 11:24:04.413
1746	486	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 11:24:04.415
1747	486	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 11:24:04.416
1748	486	SALE	Товар продан за 95 ₽	{"isCredit": false, "buyerName": "", "salePrice": 95, "buyerPhone": ""}	2025-11-02 11:24:22.46
1749	487	SYSTEM	Unit автоматически создан из продукта Переходник 1/2"(F)х3/8(М) TOPTUL	\N	2025-11-02 11:32:03.643
1750	488	SYSTEM	Unit автоматически создан из продукта Переходник 1/2"(F)х3/8(М) TOPTUL	\N	2025-11-02 11:32:21.127
1751	488	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-11-02 11:32:48.806
1752	489	SYSTEM	CLEAR unit создан как замена для кандидата #CAEA1612-20251102-143221126-057307	{"purpose": "replacement_for_candidate", "sourceUnitId": 488, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "CAEA1612-20251102-143221126-057307"}	2025-11-02 11:33:12.957
1753	488	SPROUTED	Unit преобразован в SPROUTED для создания 5 дочерних заявок	{"pricePerUnit": 3.54, "childrenCount": 5}	2025-11-02 11:33:12.963
1754	490	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 1, "parentUnitId": 488}	2025-11-02 11:33:12.965
1755	491	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 2, "parentUnitId": 488}	2025-11-02 11:33:12.968
1756	492	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 3, "parentUnitId": 488}	2025-11-02 11:33:12.971
1757	493	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 4, "parentUnitId": 488}	2025-11-02 11:33:12.974
1759	490	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 11:33:38.958
1760	490	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 11:33:38.96
1761	490	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 11:33:38.962
1762	494	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 11:33:39.592
1763	494	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 11:33:39.593
1764	494	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 11:33:39.595
1765	491	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 11:33:40.314
1766	491	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 11:33:40.316
1767	491	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 11:33:40.317
1768	492	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 11:33:40.864
1769	492	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 11:33:40.865
1770	492	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 11:33:40.867
1771	493	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 11:33:42.143
1772	493	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 11:33:42.145
1773	493	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 11:33:42.146
1774	494	SALE	Товар продан за 5 ₽	{"isCredit": false, "buyerName": "", "salePrice": 5, "buyerPhone": ""}	2025-11-02 11:33:59.359
1775	495	SYSTEM	Unit автоматически создан из продукта Головка 1/2" с насадкой TORX T60 TOPTUL	\N	2025-11-02 11:36:35.306
1776	495	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-11-02 11:36:41.376
1777	496	SYSTEM	CLEAR unit создан как замена для кандидата #BCFA1660-20251102-143635305-804568	{"purpose": "replacement_for_candidate", "sourceUnitId": 495, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "BCFA1660-20251102-143635305-804568"}	2025-11-02 11:37:07.068
1778	495	IN_REQUEST	Создана одиночная заявка, цена: 7.63	{"pricePerUnit": 7.63, "clearReplacementUnitId": 496}	2025-11-02 11:37:07.072
1779	495	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 11:37:19.938
1780	495	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 11:37:19.94
1781	495	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 11:37:19.941
1782	495	SALE	Товар продан за 13 ₽	{"isCredit": false, "buyerName": "", "salePrice": 13, "buyerPhone": ""}	2025-11-02 11:37:55.55
1783	497	SYSTEM	Unit автоматически создан из продукта Клещи для самозажимных хомутов MUBEA ARNEZI	\N	2025-11-02 11:53:44.558
1784	497	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-11-02 11:53:54.028
1785	498	SYSTEM	CLEAR unit создан как замена для кандидата #R7703502-20251102-145344556-771507	{"purpose": "replacement_for_candidate", "sourceUnitId": 497, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "R7703502-20251102-145344556-771507"}	2025-11-02 11:54:40.482
1786	497	SPROUTED	Unit преобразован в SPROUTED для создания 3 дочерних заявок	{"pricePerUnit": 14.04, "childrenCount": 3}	2025-11-02 11:54:40.498
1787	499	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 1, "parentUnitId": 497}	2025-11-02 11:54:40.5
1788	500	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 2, "parentUnitId": 497}	2025-11-02 11:54:40.503
1789	501	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 3, "parentUnitId": 497}	2025-11-02 11:54:40.506
1790	499	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 11:54:49.312
1791	499	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 11:54:49.314
1792	499	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 11:54:49.316
1793	500	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-02 11:54:53.98
1794	500	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-02 11:54:53.982
1795	500	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-02 11:54:53.984
1796	500	SALE	Товар продан за 22 ₽	{"isCredit": false, "buyerName": "", "salePrice": 22, "buyerPhone": ""}	2025-11-02 11:55:14.941
1797	189	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-03 08:20:48.955
1798	189	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-03 08:20:48.962
1799	189	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-03 08:20:48.964
1800	190	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-03 08:20:51.015
1801	190	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-03 08:20:51.016
1802	190	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-03 08:20:51.018
1803	449	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-11-03 08:21:15.216
1804	450	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-11-03 08:21:16.41
1805	502	SYSTEM	CLEAR unit создан как замена для кандидата #839 822-20251030-130913605-354547	{"purpose": "replacement_for_candidate", "sourceUnitId": 449, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "839 822-20251030-130913605-354547"}	2025-11-03 08:22:01.21
1806	449	IN_REQUEST	Создана одиночная заявка, цена: 25.74	{"pricePerUnit": 25.74, "clearReplacementUnitId": 502}	2025-11-03 08:22:01.218
1807	503	SYSTEM	CLEAR unit создан как замена для кандидата #839 816-20251030-130927803-138734	{"purpose": "replacement_for_candidate", "sourceUnitId": 450, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "839 816-20251030-130927803-138734"}	2025-11-03 08:22:13.013
1808	450	IN_REQUEST	Создана одиночная заявка, цена: 15	{"pricePerUnit": 15, "clearReplacementUnitId": 503}	2025-11-03 08:22:13.018
1809	449	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-03 08:22:15.847
1810	449	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-03 08:22:15.849
1811	449	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-03 08:22:15.85
1812	450	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-03 08:22:16.414
1813	450	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-03 08:22:16.416
1814	450	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-03 08:22:16.417
1815	389	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-03 08:24:21.538
1816	389	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-03 08:24:21.54
1817	389	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-03 08:24:21.541
1818	504	SYSTEM	Unit автоматически создан из продукта Шприц автомобильный для смазки 400мл PRO STARTUL (PRO-6065) (рычажно-плунжерный, с гибким шлангом и стальной трубкой)	\N	2025-11-03 08:59:53.571
1819	504	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-11-03 09:00:13.091
1820	505	SYSTEM	CLEAR unit создан как замена для кандидата #PRO-6065-20251103-115953569-425864	{"purpose": "replacement_for_candidate", "sourceUnitId": 504, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "PRO-6065-20251103-115953569-425864"}	2025-11-03 09:00:30.439
1821	504	IN_REQUEST	Создана одиночная заявка, цена: 29.91	{"pricePerUnit": 29.91, "clearReplacementUnitId": 505}	2025-11-03 09:00:30.45
1822	504	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-03 09:00:32.37
1823	504	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-03 09:00:32.372
1824	504	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-03 09:00:32.373
1825	504	STATUS_CHANGE	Откат статуса: IN_STORE → IN_REQUEST (возврат в запрос)	{"timestamp": "2025-11-03T09:00:33.162Z", "newCardStatus": "IN_REQUEST", "newProductStatus": null, "previousCardStatus": "ARRIVED", "previousProductStatus": "IN_STORE"}	2025-11-03 09:00:33.163
1826	504	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-03 09:00:34.491
1827	504	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-03 09:00:34.493
1828	504	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-03 09:00:34.494
1829	504	SALE	Товар продан за 40 ₽	{"isCredit": false, "buyerName": "", "salePrice": 40, "buyerPhone": ""}	2025-11-03 09:00:58.042
1830	506	SYSTEM	Unit автоматически создан из продукта Отвёртка ударная со вставками 5/16"	\N	2025-11-03 09:05:42.569
1831	506	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-11-03 09:05:56.888
1832	507	SYSTEM	CLEAR unit создан как замена для кандидата #766906-20251103-120542568-027308	{"purpose": "replacement_for_candidate", "sourceUnitId": 506, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "766906-20251103-120542568-027308"}	2025-11-03 09:07:50.733
1833	506	IN_REQUEST	Создана одиночная заявка, цена: 32	{"pricePerUnit": 32, "clearReplacementUnitId": 507}	2025-11-03 09:07:50.736
1834	506	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-03 09:07:52.742
1835	506	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-03 09:07:52.744
1836	506	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-03 09:07:52.746
1837	506	SALE	Товар продан за 40 ₽	{"isCredit": false, "buyerName": "", "salePrice": 40, "buyerPhone": ""}	2025-11-03 09:08:10.704
1838	507	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-11-03 09:08:30.297
1839	508	SYSTEM	CLEAR unit создан как замена для кандидата #766906-20251103-120750725-318048	{"purpose": "replacement_for_candidate", "sourceUnitId": 507, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "766906-20251103-120750725-318048"}	2025-11-03 09:08:55.738
1840	507	IN_REQUEST	Создана одиночная заявка, цена: 32	{"pricePerUnit": 32, "clearReplacementUnitId": 508}	2025-11-03 09:08:55.75
1841	507	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-03 09:08:57.056
1842	507	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-03 09:08:57.058
1843	507	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-03 09:08:57.059
1844	509	SYSTEM	Unit автоматически создан из продукта Вороток шарнирный 750мм 1/2''	\N	2025-11-03 09:13:18.982
1845	509	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-11-03 09:13:36.453
1846	510	SYSTEM	CLEAR unit создан как замена для кандидата #RF-8014750U-20251103-121318981-788967	{"purpose": "replacement_for_candidate", "sourceUnitId": 509, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "RF-8014750U-20251103-121318981-788967"}	2025-11-03 09:13:57.716
1847	509	IN_REQUEST	Создана одиночная заявка, цена: 31.41	{"pricePerUnit": 31.41, "clearReplacementUnitId": 510}	2025-11-03 09:13:57.72
1848	509	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-03 09:13:59.232
1849	509	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-03 09:13:59.234
1850	509	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-03 09:13:59.235
1851	509	SALE	Товар продан за 38 ₽	{"isCredit": false, "buyerName": "", "salePrice": 38, "buyerPhone": ""}	2025-11-03 09:14:18.907
1852	511	SYSTEM	Unit автоматически создан из продукта Головка ударная 19мм (6гр.), 1/2''	\N	2025-11-03 09:17:02.092
1853	511	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-11-03 09:17:28.745
1854	512	SYSTEM	CLEAR unit создан как замена для кандидата #RF-44519-20251103-121702091-408061	{"purpose": "replacement_for_candidate", "sourceUnitId": 511, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "RF-44519-20251103-121702091-408061"}	2025-11-03 09:18:01.53
1855	511	IN_REQUEST	Создана одиночная заявка, цена: 2.07	{"pricePerUnit": 2.07, "clearReplacementUnitId": 512}	2025-11-03 09:18:01.56
1856	511	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-03 09:18:02.922
1857	511	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-03 09:18:02.924
1858	511	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-03 09:18:02.926
1859	511	SALE	Товар продан за 5 ₽	{"isCredit": false, "buyerName": "", "salePrice": 5, "buyerPhone": ""}	2025-11-03 09:18:15.093
1860	513	SYSTEM	Unit автоматически создан из продукта Головка 46мм (12гр.), 3/4''	\N	2025-11-03 09:20:08.513
1861	513	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-11-03 09:21:04.557
1862	514	SYSTEM	CLEAR unit создан как замена для кандидата #FK-56946-20251103-122008512-047899	{"purpose": "replacement_for_candidate", "sourceUnitId": 513, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "FK-56946-20251103-122008512-047899"}	2025-11-03 09:21:23.428
1863	513	IN_REQUEST	Создана одиночная заявка, цена: 16.47	{"pricePerUnit": 16.47, "clearReplacementUnitId": 514}	2025-11-03 09:21:23.441
1864	513	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-03 09:21:24.854
1865	513	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-03 09:21:24.856
1866	513	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-03 09:21:24.858
1867	513	SALE	Товар продан за 22 ₽	{"isCredit": false, "buyerName": "", "salePrice": 22, "buyerPhone": ""}	2025-11-03 09:21:40.524
1868	515	SYSTEM	Unit автоматически создан из продукта Съемник стопорных колец прямой на сжатие (L-175мм), в блистере	\N	2025-11-03 09:25:49.499
1869	515	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-11-03 09:26:04.5
1870	516	SYSTEM	CLEAR unit создан как замена для кандидата #PA-68-175HS-20251103-122549498-160031	{"purpose": "replacement_for_candidate", "sourceUnitId": 515, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "PA-68-175HS-20251103-122549498-160031"}	2025-11-03 09:26:46.325
1871	515	SPROUTED	Unit преобразован в SPROUTED для создания 3 дочерних заявок	{"pricePerUnit": 8.7, "childrenCount": 3}	2025-11-03 09:26:46.331
1872	517	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 1, "parentUnitId": 515}	2025-11-03 09:26:46.333
1873	518	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 2, "parentUnitId": 515}	2025-11-03 09:26:46.336
1874	519	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 3, "parentUnitId": 515}	2025-11-03 09:26:46.367
1875	517	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-03 09:26:57.959
1876	517	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-03 09:26:57.96
1877	517	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-03 09:26:57.962
1878	518	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-03 09:26:58.748
1879	518	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-03 09:26:58.75
1880	518	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-03 09:26:58.752
1881	517	STATUS_CHANGE	Откат статуса: IN_STORE → IN_REQUEST (возврат в запрос)	{"timestamp": "2025-11-03T09:27:00.803Z", "newCardStatus": "IN_REQUEST", "newProductStatus": null, "previousCardStatus": "ARRIVED", "previousProductStatus": "IN_STORE"}	2025-11-03 09:27:00.804
1882	518	STATUS_CHANGE	Откат статуса: IN_STORE → IN_REQUEST (возврат в запрос)	{"timestamp": "2025-11-03T09:27:01.229Z", "newCardStatus": "IN_REQUEST", "newProductStatus": null, "previousCardStatus": "ARRIVED", "previousProductStatus": "IN_STORE"}	2025-11-03 09:27:01.23
1883	519	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-11-03 09:27:04.459
1884	519	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-11-03 09:27:04.461
1885	519	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-11-03 09:27:04.462
1886	519	SALE	Товар продан за 13 ₽	{"isCredit": false, "buyerName": "", "salePrice": 13, "buyerPhone": ""}	2025-11-03 09:27:16.561
1887	499	SALE	Товар продан за 22 ₽	{"isCredit": false, "buyerName": "", "salePrice": 22, "buyerPhone": ""}	2025-11-03 10:03:55.258
\.


--
-- Data for Name: product_units; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_units (id, serial_number, "productId", sale_price, sold_at, created_at, updated_at, credit_paid_at, "isReturned", is_credit, "parentProductUnitId", product_category_id, product_category_name, product_code, product_description, product_name, product_tags, request_price_per_unit, returned_at, "statusCard", "statusProduct", created_at_candidate, created_at_request, "customerId", quantity_in_candidate, quantity_in_request, "supplierId", "spineId", "disassembledParentId", "disassemblyStatus", "isParsingAlgorithm", "disassemblyScenarioId") FROM stdin;
10	1767540-20251025-094536358-287384/child-1-1761374974952-wllsj3hq9	3	\N	\N	2025-10-25 06:49:34.954	2025-10-25 06:49:53.737	\N	f	f	8	17	Torx_17675	1767540		Бита Torx T40 10 мм. FORCE 1767540	null	3.06	\N	ARRIVED	IN_STORE	\N	2025-10-25 06:49:34.953	\N	0	0	\N	3	\N	MONOLITH	f	\N
17	CAEA1208-20251025-095532805-643593	4	\N	\N	2025-10-25 06:55:32.806	2025-10-25 06:55:32.806	\N	f	f	\N	19	Переходник 3/8	CAEA1208		Переходник 3/8"(F)х1/4(М) TOPTUL	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	4	\N	MONOLITH	f	\N
16	CAEA1208-20251025-095419393-323579	4	\N	\N	2025-10-25 06:54:19.395	2025-10-25 06:55:32.812	\N	f	f	\N	19	Переходник 3/8	CAEA1208		Переходник 3/8"(F)х1/4(М) TOPTUL	null	\N	\N	SPROUTED	\N	2025-10-25 06:54:38.548	\N	\N	1	0	\N	4	\N	MONOLITH	f	\N
1	SG-35C14-20251024-153032140-515202	1	35	2025-10-24 12:31:56.104	2025-10-24 12:30:32.142	2025-10-24 12:31:56.105	\N	f	f	\N	3	Пистолет для гравитекса	SG-35C14		Пистолет для антикоррозионных покрытий SG-35C14 ECO со шлангом	null	27.49	\N	ARRIVED	SOLD	2025-10-24 12:30:41.904	2025-10-24 12:31:14.972	\N	1	0	\N	1	\N	MONOLITH	f	\N
9	1767540-20251025-094934933-947077	3	\N	\N	2025-10-25 06:49:34.935	2025-10-25 06:49:34.935	\N	f	f	\N	17	Torx_17675	1767540		Бита Torx T40 10 мм. FORCE 1767540	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	3	\N	MONOLITH	f	\N
8	1767540-20251025-094536358-287384	3	\N	\N	2025-10-25 06:45:36.36	2025-10-25 06:49:34.951	\N	f	f	\N	17	Torx_17675	1767540		Бита Torx T40 10 мм. FORCE 1767540	null	\N	\N	SPROUTED	\N	2025-10-25 06:45:54.099	\N	\N	1	0	\N	3	\N	MONOLITH	f	\N
3	622021-20251024-153909716-735277	2	6	2025-10-24 12:41:07.507	2025-10-24 12:39:09.717	2025-10-24 12:41:07.508	\N	f	f	\N	7	12-граней	622021		Головка двенадцатигранная 21 мм 1/2"	null	3.18	\N	ARRIVED	SOLD	2025-10-24 12:39:23.955	2025-10-24 12:40:41.608	\N	1	0	\N	2	\N	MONOLITH	f	\N
5	SG-35C14-20251024-154448093-201531	1	\N	\N	2025-10-24 12:44:48.095	2025-10-24 12:44:48.095	\N	f	f	\N	3	Пистолет для гравитекса	SG-35C14		Пистолет для антикоррозионных покрытий SG-35C14 ECO со шлангом	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	1	\N	MONOLITH	f	\N
2	SG-35C14-20251024-153114960-841163	1	\N	\N	2025-10-24 12:31:14.961	2025-10-24 12:44:48.109	\N	f	f	\N	3	Пистолет для гравитекса	SG-35C14		Пистолет для антикоррозионных покрытий SG-35C14 ECO со шлангом	null	\N	\N	SPROUTED	\N	2025-10-24 12:44:26.344	\N	\N	1	0	\N	1	\N	MONOLITH	f	\N
11	1767540-20251025-094536358-287384/child-2-1761374974957-mf1qsl4ag	3	\N	\N	2025-10-25 06:49:34.958	2025-10-25 06:49:54.373	\N	f	f	8	17	Torx_17675	1767540		Бита Torx T40 10 мм. FORCE 1767540	null	3.06	\N	ARRIVED	IN_STORE	\N	2025-10-25 06:49:34.957	\N	0	0	\N	3	\N	MONOLITH	f	\N
7	SG-35C14-20251024-153114960-841163/child-2-1761309888114-l9f85q7c3	1	35	2025-11-02 10:53:35.799	2025-10-24 12:44:48.115	2025-11-02 10:53:35.807	\N	f	f	2	3	Пистолет для гравитекса	SG-35C14		Пистолет для антикоррозионных покрытий SG-35C14 ECO со шлангом	null	27.49	\N	ARRIVED	SOLD	\N	2025-10-24 12:44:48.114	\N	0	0	\N	1	\N	MONOLITH	f	\N
6	SG-35C14-20251024-153114960-841163/child-1-1761309888111-78p2gdzgu	1	\N	\N	2025-10-24 12:44:48.112	2025-10-24 12:45:15.477	\N	f	f	2	3	Пистолет для гравитекса	SG-35C14		Пистолет для антикоррозионных покрытий SG-35C14 ECO со шлангом	null	27.49	\N	ARRIVED	IN_STORE	\N	2025-10-24 12:44:48.111	\N	0	0	\N	1	\N	MONOLITH	f	\N
12	1767540-20251025-094536358-287384/child-3-1761374974961-k51770zre	3	\N	\N	2025-10-25 06:49:34.962	2025-10-25 06:49:55.961	\N	f	f	8	17	Torx_17675	1767540		Бита Torx T40 10 мм. FORCE 1767540	null	3.06	\N	ARRIVED	IN_STORE	\N	2025-10-25 06:49:34.961	\N	0	0	\N	3	\N	MONOLITH	f	\N
19	CAEA1208-20251025-095419393-323579/child-2-1761375332817-t0r4mxx0z	4	\N	\N	2025-10-25 06:55:32.818	2025-10-25 06:55:45.083	\N	f	f	16	19	Переходник 3/8	CAEA1208		Переходник 3/8"(F)х1/4(М) TOPTUL	null	1.74	\N	ARRIVED	IN_STORE	\N	2025-10-25 06:55:32.817	\N	0	0	\N	4	\N	MONOLITH	f	\N
13	1767540-20251025-094536358-287384/child-4-1761374974964-36gjii4zc	3	\N	\N	2025-10-25 06:49:34.966	2025-10-25 06:49:57.057	\N	f	f	8	17	Torx_17675	1767540		Бита Torx T40 10 мм. FORCE 1767540	null	3.06	\N	ARRIVED	IN_STORE	\N	2025-10-25 06:49:34.964	\N	0	0	\N	3	\N	MONOLITH	f	\N
15	1767540-20251025-094536358-287384/child-6-1761374974970-soh1nzyhw	3	6	2025-10-25 06:50:20.091	2025-10-25 06:49:34.972	2025-10-25 06:50:20.092	\N	f	f	8	17	Torx_17675	1767540		Бита Torx T40 10 мм. FORCE 1767540	null	3.06	\N	ARRIVED	SOLD	\N	2025-10-25 06:49:34.97	\N	0	0	\N	3	\N	MONOLITH	f	\N
4	622021-20251024-154041595-882958	2	6	2025-10-25 12:46:37.246	2025-10-24 12:40:41.596	2025-10-25 12:46:37.247	\N	f	f	\N	7	12-граней	622021		Головка двенадцатигранная 21 мм 1/2"	null	3.18	\N	ARRIVED	SOLD	2025-10-25 12:44:48.413	2025-10-25 12:45:35.199	\N	1	0	\N	2	\N	MONOLITH	f	\N
18	CAEA1208-20251025-095419393-323579/child-1-1761375332813-4acfp0d2t	4	\N	\N	2025-10-25 06:55:32.815	2025-10-25 06:55:43.728	\N	f	f	16	19	Переходник 3/8	CAEA1208		Переходник 3/8"(F)х1/4(М) TOPTUL	null	1.74	\N	ARRIVED	IN_STORE	\N	2025-10-25 06:55:32.813	\N	0	0	\N	4	\N	MONOLITH	f	\N
22	FSEB1240-20251025-100517001-470192	5	\N	\N	2025-10-25 07:05:17.003	2025-10-25 07:05:17.003	\N	f	f	\N	17	Torx_17675	FSEB1240		Насадка TORX T40 75мм LONG TOPTUL	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	3	\N	MONOLITH	f	\N
21	FSEB1240-20251025-100425029-550485	5	\N	\N	2025-10-25 07:04:25.031	2025-10-25 07:05:17.018	\N	f	f	\N	17	Torx_17675	FSEB1240		Насадка TORX T40 75мм LONG TOPTUL	null	\N	\N	SPROUTED	\N	2025-10-25 07:04:40.982	\N	\N	1	0	\N	3	\N	MONOLITH	f	\N
27	1763040-20251025-101159689-240809	6	\N	\N	2025-10-25 07:11:59.69	2025-10-25 07:11:59.69	\N	f	f	\N	20	torx-17630	1763040		Бита Torx T40 10 мм. FORCE 1763040	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	5	\N	MONOLITH	f	\N
20	CAEA1208-20251025-095419393-323579/child-3-1761375332820-zlvf6nxxe	4	5	2025-10-25 06:56:07.022	2025-10-25 06:55:32.821	2025-10-25 06:56:07.023	\N	f	f	16	19	Переходник 3/8	CAEA1208		Переходник 3/8"(F)х1/4(М) TOPTUL	null	1.74	\N	ARRIVED	SOLD	\N	2025-10-25 06:55:32.82	\N	0	0	\N	4	\N	MONOLITH	f	\N
23	FSEB1240-20251025-100425029-550485/child-1-1761375917019-7v37p13nu	5	\N	\N	2025-10-25 07:05:17.021	2025-10-25 07:05:27.964	\N	f	f	21	17	Torx_17675	FSEB1240		Насадка TORX T40 75мм LONG TOPTUL	null	3.27	\N	ARRIVED	IN_STORE	\N	2025-10-25 07:05:17.019	\N	0	0	\N	3	\N	MONOLITH	f	\N
24	FSEB1240-20251025-100425029-550485/child-2-1761375917023-vtjvtlpc1	5	\N	\N	2025-10-25 07:05:17.025	2025-10-25 07:05:28.488	\N	f	f	21	17	Torx_17675	FSEB1240		Насадка TORX T40 75мм LONG TOPTUL	null	3.27	\N	ARRIVED	IN_STORE	\N	2025-10-25 07:05:17.023	\N	0	0	\N	3	\N	MONOLITH	f	\N
25	FSEB1240-20251025-100425029-550485/child-3-1761375917026-owqx2vw8o	5	\N	\N	2025-10-25 07:05:17.028	2025-10-25 07:05:29.53	\N	f	f	21	17	Torx_17675	FSEB1240		Насадка TORX T40 75мм LONG TOPTUL	null	3.27	\N	ARRIVED	IN_STORE	\N	2025-10-25 07:05:17.026	\N	0	0	\N	3	\N	MONOLITH	f	\N
26	1763040-20251025-101117415-361590	6	\N	\N	2025-10-25 07:11:17.416	2025-10-25 07:11:59.704	\N	f	f	\N	20	torx-17630	1763040		Бита Torx T40 10 мм. FORCE 1763040	null	\N	\N	SPROUTED	\N	2025-10-25 07:11:32.866	\N	\N	1	0	\N	5	\N	MONOLITH	f	\N
14	1767540-20251025-094536358-287384/child-5-1761374974967-j4a9b4yle	3	6	2025-10-29 06:15:21.224	2025-10-25 06:49:34.969	2025-10-29 06:15:21.225	\N	f	f	8	17	Torx_17675	1767540		Бита Torx T40 10 мм. FORCE 1767540	null	3.06	\N	ARRIVED	SOLD	\N	2025-10-25 06:49:34.968	\N	0	0	\N	3	\N	MONOLITH	f	\N
28	1763040-20251025-101117415-361590/child-1-1761376319706-s4q79s0vx	6	\N	\N	2025-10-25 07:11:59.707	2025-10-25 07:12:08.769	\N	f	f	26	20	torx-17630	1763040		Бита Torx T40 10 мм. FORCE 1763040	null	2.22	\N	ARRIVED	IN_STORE	\N	2025-10-25 07:11:59.706	\N	0	0	\N	5	\N	MONOLITH	f	\N
29	1763040-20251025-101117415-361590/child-2-1761376319709-uxo7q14f1	6	\N	\N	2025-10-25 07:11:59.71	2025-10-25 07:12:09.386	\N	f	f	26	20	torx-17630	1763040		Бита Torx T40 10 мм. FORCE 1763040	null	2.22	\N	ARRIVED	IN_STORE	\N	2025-10-25 07:11:59.709	\N	0	0	\N	5	\N	MONOLITH	f	\N
42	BAEB1617-20251025-105723017-677923	10	\N	\N	2025-10-25 07:57:23.018	2025-10-25 07:57:23.018	\N	f	f	\N	7	12-граней	BAEB1617		Головка 1/2" 17мм 12гр.TOPTUL	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	8	\N	MONOLITH	f	\N
35	ST4581-20251025-104247033-208418	8	50	2025-10-25 07:44:07.913	2025-10-25 07:42:47.034	2025-10-25 07:44:07.914	\N	f	f	\N	32	Вытяжной	ST4581		Заклепочник поворотный усиленный 2,4-4,8мм STARTUL PROFI (ST4581)	null	34.55	\N	ARRIVED	SOLD	2025-10-25 07:43:04.855	2025-10-25 07:43:32.744	\N	1	0	\N	7	\N	MONOLITH	f	\N
30	1763040-20251025-101117415-361590/child-3-1761376319712-ld8sj1y4d	6	\N	\N	2025-10-25 07:11:59.713	2025-10-25 07:12:10.283	\N	f	f	26	20	torx-17630	1763040		Бита Torx T40 10 мм. FORCE 1763040	null	2.22	\N	ARRIVED	IN_STORE	\N	2025-10-25 07:11:59.713	\N	0	0	\N	5	\N	MONOLITH	f	\N
46	63005B-20251025-110751615-162873	12	\N	\N	2025-10-25 08:07:51.617	2025-10-25 08:08:44.081	\N	f	f	\N	47	Экстракторы Шпильки	63005B		Набор экстракторов 5пр. FORCE 63005B	null	23.04	\N	ARRIVED	IN_STORE	2025-10-25 08:08:03.67	2025-10-25 08:08:42.082	\N	1	0	\N	9	\N	MONOLITH	f	\N
31	1763040-20251025-101117415-361590/child-4-1761376319716-hn4yfqxan	6	\N	\N	2025-10-25 07:11:59.717	2025-10-25 07:12:13.113	\N	f	f	26	20	torx-17630	1763040		Бита Torx T40 10 мм. FORCE 1763040	null	2.22	\N	ARRIVED	IN_STORE	\N	2025-10-25 07:11:59.716	\N	0	0	\N	5	\N	MONOLITH	f	\N
38	622017-20251025-105357193-212954	9	\N	\N	2025-10-25 07:53:57.195	2025-10-25 07:53:57.195	\N	f	f	\N	7	12-граней	622017		Головка двенадцатигранная 17мм 1/2"	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	8	\N	MONOLITH	f	\N
37	622017-20251025-105255381-772913	9	\N	\N	2025-10-25 07:52:55.383	2025-10-25 07:53:57.209	\N	f	f	\N	7	12-граней	622017		Головка двенадцатигранная 17мм 1/2"	null	\N	\N	SPROUTED	\N	2025-10-25 07:53:23.654	\N	\N	1	0	\N	8	\N	MONOLITH	f	\N
32	1763040-20251025-101117415-361590/child-5-1761376319719-3uegw7ucn	6	\N	\N	2025-10-25 07:11:59.72	2025-10-25 07:12:13.868	\N	f	f	26	20	torx-17630	1763040		Бита Torx T40 10 мм. FORCE 1763040	null	2.22	\N	ARRIVED	IN_STORE	\N	2025-10-25 07:11:59.719	\N	0	0	\N	5	\N	MONOLITH	f	\N
50	620 017-20251025-111610803-811809	14	\N	\N	2025-10-25 08:16:10.804	2025-10-25 08:17:18.633	\N	f	f	\N	9	6-граней	620 017		Головка шестигранная 17мм 1/2"	null	\N	\N	SPROUTED	\N	2025-10-25 08:16:27.563	\N	\N	1	0	\N	10	\N	MONOLITH	f	\N
33	R7401001-20251025-103308424-642495	7	\N	\N	2025-10-25 07:33:08.425	2025-10-25 07:34:17.189	\N	f	f	\N	29	ТАЗИКИ	R7401001		ARNEZI R7401001 Поддон для слива масла 8 л.	null	21.54	\N	ARRIVED	IN_STORE	2025-10-25 07:33:32.462	2025-10-25 07:34:13.749	\N	1	0	\N	6	\N	MONOLITH	f	\N
39	622017-20251025-105255381-772913/child-1-1761378837211-99v9qsx81	9	\N	\N	2025-10-25 07:53:57.212	2025-10-25 07:54:13.244	\N	f	f	37	7	12-граней	622017		Головка двенадцатигранная 17мм 1/2"	null	2.4	\N	ARRIVED	IN_STORE	\N	2025-10-25 07:53:57.211	\N	0	0	\N	8	\N	MONOLITH	f	\N
36	ST4581-20251025-104332731-120361	8	\N	\N	2025-10-25 07:43:32.733	2025-10-25 07:43:32.733	\N	f	f	\N	32	Вытяжной	ST4581		Заклепочник поворотный усиленный 2,4-4,8мм STARTUL PROFI (ST4581)	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	7	\N	MONOLITH	f	\N
41	BAEB1617-20251025-105628451-379900	10	\N	\N	2025-10-25 07:56:28.452	2025-10-25 07:57:25.609	\N	f	f	\N	7	12-граней	BAEB1617		Головка 1/2" 17мм 12гр.TOPTUL	null	3.22	\N	ARRIVED	IN_STORE	2025-10-25 07:56:46.533	2025-10-25 07:57:23.03	\N	1	0	\N	8	\N	MONOLITH	f	\N
44	54917-20251025-110320960-683024	11	\N	\N	2025-10-25 08:03:20.962	2025-10-25 08:04:14.086	\N	f	f	\N	7	12-граней	54917		Головка 17 мм 12-гранная 1/2DR короткая FORCE 54917	null	6.96	\N	ARRIVED	IN_STORE	2025-10-25 08:03:50.453	2025-10-25 08:04:12.632	\N	1	0	\N	8	\N	MONOLITH	f	\N
40	622017-20251025-105255381-772913/child-2-1761378837214-pmzmplqoh	9	\N	\N	2025-10-25 07:53:57.215	2025-10-25 07:54:14.051	\N	f	f	37	7	12-граней	622017		Головка двенадцатигранная 17мм 1/2"	null	2.4	\N	ARRIVED	IN_STORE	\N	2025-10-25 07:53:57.214	\N	0	0	\N	8	\N	MONOLITH	f	\N
49	YT0590-20251025-111056133-889899	13	\N	\N	2025-10-25 08:10:56.134	2025-10-25 08:10:56.134	\N	f	f	\N	47	Экстракторы Шпильки	YT0590		Набор экстракторов для извлечения обломанных болтов 6пр	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	9	\N	MONOLITH	f	\N
47	63005B-20251025-110842069-500509	12	\N	\N	2025-10-25 08:08:42.071	2025-10-25 08:08:42.071	\N	f	f	\N	47	Экстракторы Шпильки	63005B		Набор экстракторов 5пр. FORCE 63005B	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	9	\N	MONOLITH	f	\N
48	YT0590-20251025-111012441-510525	13	\N	\N	2025-10-25 08:10:12.442	2025-10-25 08:10:58.855	\N	f	f	\N	47	Экстракторы Шпильки	YT0590		Набор экстракторов для извлечения обломанных болтов 6пр	null	11.88	\N	ARRIVED	IN_STORE	2025-10-25 08:10:24.407	2025-10-25 08:10:56.146	\N	1	0	\N	9	\N	MONOLITH	f	\N
43	54917-20251025-110221051-497690	11	\N	\N	2025-10-25 08:02:21.052	2025-10-25 08:03:23.818	\N	f	f	\N	7	12-граней	54917		Головка 17 мм 12-гранная 1/2DR короткая FORCE 54917	null	6.96	\N	ARRIVED	IN_STORE	2025-10-25 08:02:47.282	2025-10-25 08:03:20.965	\N	1	0	\N	8	\N	MONOLITH	f	\N
45	54917-20251025-110412619-323415	11	\N	\N	2025-10-25 08:04:12.621	2025-10-25 08:04:12.621	\N	f	f	\N	7	12-граней	54917		Головка 17 мм 12-гранная 1/2DR короткая FORCE 54917	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	8	\N	MONOLITH	f	\N
34	R7401001-20251025-103413735-302508	7	30	2025-10-29 09:57:58.427	2025-10-25 07:34:13.737	2025-10-29 09:57:58.428	\N	f	f	\N	29	ТАЗИКИ	R7401001		ARNEZI R7401001 Поддон для слива масла 8 л.	null	22.66	\N	ARRIVED	SOLD	\N	2025-10-28 11:16:11.861	\N	0	0	\N	6	\N	MONOLITH	f	\N
51	620 017-20251025-111718624-219564	14	\N	\N	2025-10-25 08:17:18.626	2025-10-25 08:17:18.626	\N	f	f	\N	9	6-граней	620 017		Головка шестигранная 17мм 1/2"	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	10	\N	MONOLITH	f	\N
54	620 017-20251025-111610803-811809/child-3-1761380238641-i5imq5m2a	14	\N	\N	2025-10-25 08:17:18.642	2025-10-25 08:17:39.457	\N	f	f	50	9	6-граней	620 017		Головка шестигранная 17мм 1/2"	null	2.16	\N	ARRIVED	IN_STORE	\N	2025-10-25 08:17:18.641	\N	0	0	\N	10	\N	MONOLITH	f	\N
53	620 017-20251025-111610803-811809/child-2-1761380238638-qxvt3lgqa	14	\N	\N	2025-10-25 08:17:18.639	2025-10-25 08:17:41.147	\N	f	f	50	9	6-граней	620 017		Головка шестигранная 17мм 1/2"	null	2.16	\N	ARRIVED	IN_STORE	\N	2025-10-25 08:17:18.638	\N	0	0	\N	10	\N	MONOLITH	f	\N
52	620 017-20251025-111610803-811809/child-1-1761380238634-frmjfumz1	14	\N	\N	2025-10-25 08:17:18.635	2025-10-25 08:17:41.797	\N	f	f	50	9	6-граней	620 017		Головка шестигранная 17мм 1/2"	null	2.16	\N	ARRIVED	IN_STORE	\N	2025-10-25 08:17:18.634	\N	0	0	\N	10	\N	MONOLITH	f	\N
64	54517-20251025-112001236-388502/child-3-1761380452465-9md9okgyb	15	\N	\N	2025-10-25 08:20:52.467	2025-10-25 08:21:08.099	\N	f	f	60	9	6-граней	54517		Головка 17 мм 6-гранная 1/2DR короткая FORCE 54517	null	5.82	\N	ARRIVED	IN_STORE	\N	2025-10-25 08:20:52.465	\N	0	0	\N	10	\N	MONOLITH	f	\N
59	620 017-20251025-111610803-811809/child-8-1761380238656-4jr48fmn4	14	\N	\N	2025-10-25 08:17:18.657	2025-10-25 08:17:35.484	\N	f	f	50	9	6-граней	620 017		Головка шестигранная 17мм 1/2"	null	2.16	\N	ARRIVED	IN_STORE	\N	2025-10-25 08:17:18.656	\N	0	0	\N	10	\N	MONOLITH	f	\N
69	32332065-20251025-114707997-084641	18	\N	\N	2025-10-25 08:47:07.998	2025-10-25 08:49:53.103	\N	f	f	\N	48	1/4 запрессованные	32332065		Головка-бита Slotted 1.2x6.5 мм. 1/4” FORCE 32332065	null	\N	\N	SPROUTED	\N	2025-10-25 08:47:29.756	\N	\N	1	0	\N	15	\N	MONOLITH	f	\N
77	321322-20251025-114657620-048311/child-7-1761382110153-rj5b8wcde	19	4	2025-10-25 08:54:32.949	2025-10-25 08:48:30.154	2025-10-25 08:54:32.95	\N	f	f	68	48	1/4 запрессованные	321322		Головка-бита Philips PH.2 1/4'' FORCE 321322	null	2.16	\N	ARRIVED	SOLD	\N	2025-10-25 08:48:30.153	\N	0	0	\N	18	\N	MONOLITH	f	\N
58	620 017-20251025-111610803-811809/child-7-1761380238653-vkep0u202	14	\N	\N	2025-10-25 08:17:18.654	2025-10-25 08:17:36.153	\N	f	f	50	9	6-граней	620 017		Головка шестигранная 17мм 1/2"	null	2.16	\N	ARRIVED	IN_STORE	\N	2025-10-25 08:17:18.653	\N	0	0	\N	10	\N	MONOLITH	f	\N
63	54517-20251025-112001236-388502/child-2-1761380452462-fnh859a74	15	\N	\N	2025-10-25 08:20:52.463	2025-10-25 08:21:08.823	\N	f	f	60	9	6-граней	54517		Головка 17 мм 6-гранная 1/2DR короткая FORCE 54517	null	5.82	\N	ARRIVED	IN_STORE	\N	2025-10-25 08:20:52.462	\N	0	0	\N	10	\N	MONOLITH	f	\N
70	321322-20251025-114830126-129738	19	\N	\N	2025-10-25 08:48:30.127	2025-10-25 08:48:30.127	\N	f	f	\N	48	1/4 запрессованные	321322		Головка-бита Philips PH.2 1/4'' FORCE 321322	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	18	\N	MONOLITH	f	\N
57	620 017-20251025-111610803-811809/child-6-1761380238650-luktsf8tr	14	\N	\N	2025-10-25 08:17:18.651	2025-10-25 08:17:37.288	\N	f	f	50	9	6-граней	620 017		Головка шестигранная 17мм 1/2"	null	2.16	\N	ARRIVED	IN_STORE	\N	2025-10-25 08:17:18.65	\N	0	0	\N	10	\N	MONOLITH	f	\N
56	620 017-20251025-111610803-811809/child-5-1761380238647-yzk5do2iy	14	\N	\N	2025-10-25 08:17:18.648	2025-10-25 08:17:37.991	\N	f	f	50	9	6-граней	620 017		Головка шестигранная 17мм 1/2"	null	2.16	\N	ARRIVED	IN_STORE	\N	2025-10-25 08:17:18.647	\N	0	0	\N	10	\N	MONOLITH	f	\N
55	620 017-20251025-111610803-811809/child-4-1761380238644-9jnjfcuwp	14	\N	\N	2025-10-25 08:17:18.645	2025-10-25 08:17:38.694	\N	f	f	50	9	6-граней	620 017		Головка шестигранная 17мм 1/2"	null	2.16	\N	ARRIVED	IN_STORE	\N	2025-10-25 08:17:18.644	\N	0	0	\N	10	\N	MONOLITH	f	\N
68	321322-20251025-114657620-048311	19	\N	\N	2025-10-25 08:46:57.621	2025-10-25 08:48:30.133	\N	f	f	\N	48	1/4 запрессованные	321322		Головка-бита Philips PH.2 1/4'' FORCE 321322	null	\N	\N	SPROUTED	\N	2025-10-25 08:47:28.889	\N	\N	1	0	\N	18	\N	MONOLITH	f	\N
61	54517-20251025-112052447-868906	15	\N	\N	2025-10-25 08:20:52.449	2025-10-25 08:20:52.449	\N	f	f	\N	9	6-граней	54517		Головка 17 мм 6-гранная 1/2DR короткая FORCE 54517	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	10	\N	MONOLITH	f	\N
60	54517-20251025-112001236-388502	15	\N	\N	2025-10-25 08:20:01.238	2025-10-25 08:20:52.456	\N	f	f	\N	9	6-граней	54517		Головка 17 мм 6-гранная 1/2DR короткая FORCE 54517	null	\N	\N	SPROUTED	\N	2025-10-25 08:20:14.636	\N	\N	1	0	\N	10	\N	MONOLITH	f	\N
62	54517-20251025-112001236-388502/child-1-1761380452458-rx78exxmy	15	\N	\N	2025-10-25 08:20:52.459	2025-10-25 08:21:09.538	\N	f	f	60	9	6-граней	54517		Головка 17 мм 6-гранная 1/2DR короткая FORCE 54517	null	5.82	\N	ARRIVED	IN_STORE	\N	2025-10-25 08:20:52.458	\N	0	0	\N	10	\N	MONOLITH	f	\N
65	54517-20251025-112001236-388502/child-4-1761380452469-ztoq5043p	15	\N	\N	2025-10-25 08:20:52.47	2025-10-25 08:21:07.477	\N	f	f	60	9	6-граней	54517		Головка 17 мм 6-гранная 1/2DR короткая FORCE 54517	null	5.82	\N	ARRIVED	IN_STORE	\N	2025-10-25 08:20:52.469	\N	0	0	\N	10	\N	MONOLITH	f	\N
67	BAEA1617-20251025-112620170-351118	16	\N	\N	2025-10-25 08:26:20.171	2025-10-25 08:26:20.171	\N	f	f	\N	9	6-граней	BAEA1617		Головка 1/2" 17мм 6гр.TOPTUL	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	10	\N	MONOLITH	f	\N
66	BAEA1617-20251025-112534403-186662	16	\N	\N	2025-10-25 08:25:34.405	2025-10-25 08:26:25.134	\N	f	f	\N	9	6-граней	BAEA1617		Головка 1/2" 17мм 6гр.TOPTUL	null	3.22	\N	ARRIVED	IN_STORE	2025-10-25 08:25:53.554	2025-10-25 08:26:20.175	\N	1	0	\N	10	\N	MONOLITH	f	\N
78	32332065-20251025-114953093-181996	18	\N	\N	2025-10-25 08:49:53.094	2025-10-25 08:49:53.094	\N	f	f	\N	48	1/4 запрессованные	32332065		Головка-бита Slotted 1.2x6.5 мм. 1/4” FORCE 32332065	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	15	\N	MONOLITH	f	\N
380	Sch-TAP8x1-20251029-123255630-324352	82	\N	\N	2025-10-29 09:32:55.631	2025-10-29 09:33:49.649	\N	f	f	\N	113	Метчики поштучно	Sch-TAP8x1		Метчик M8x1 (3шт)	null	4.74	\N	ARRIVED	IN_STORE	2025-10-29 09:33:14.89	2025-10-29 09:33:45.252	\N	1	0	\N	84	\N	MONOLITH	f	\N
73	321322-20251025-114657620-048311/child-3-1761382110141-0yxxh0uaf	19	\N	\N	2025-10-25 08:48:30.142	2025-10-25 08:50:05.81	\N	f	f	68	48	1/4 запрессованные	321322		Головка-бита Philips PH.2 1/4'' FORCE 321322	null	2.16	\N	ARRIVED	IN_STORE	\N	2025-10-25 08:48:30.142	\N	0	0	\N	18	\N	MONOLITH	f	\N
74	321322-20251025-114657620-048311/child-4-1761382110144-7skruejdi	19	\N	\N	2025-10-25 08:48:30.145	2025-10-25 08:50:06.701	\N	f	f	68	48	1/4 запрессованные	321322		Головка-бита Philips PH.2 1/4'' FORCE 321322	null	2.16	\N	ARRIVED	IN_STORE	\N	2025-10-25 08:48:30.144	\N	0	0	\N	18	\N	MONOLITH	f	\N
75	321322-20251025-114657620-048311/child-5-1761382110147-7irfzgdb0	19	\N	\N	2025-10-25 08:48:30.148	2025-10-25 08:50:07.274	\N	f	f	68	48	1/4 запрессованные	321322		Головка-бита Philips PH.2 1/4'' FORCE 321322	null	2.16	\N	ARRIVED	IN_STORE	\N	2025-10-25 08:48:30.147	\N	0	0	\N	18	\N	MONOLITH	f	\N
76	321322-20251025-114657620-048311/child-6-1761382110150-qokng3z76	19	\N	\N	2025-10-25 08:48:30.151	2025-10-25 08:50:07.88	\N	f	f	68	48	1/4 запрессованные	321322		Головка-бита Philips PH.2 1/4'' FORCE 321322	null	2.16	\N	ARRIVED	IN_STORE	\N	2025-10-25 08:48:30.15	\N	0	0	\N	18	\N	MONOLITH	f	\N
79	32332065-20251025-114707997-084641/child-1-1761382193104-i94gtl07b	18	\N	\N	2025-10-25 08:49:53.105	2025-10-25 08:50:10.401	\N	f	f	69	48	1/4 запрессованные	32332065		Головка-бита Slotted 1.2x6.5 мм. 1/4” FORCE 32332065	null	2.16	\N	ARRIVED	IN_STORE	\N	2025-10-25 08:49:53.105	\N	0	0	\N	15	\N	MONOLITH	f	\N
80	32332065-20251025-114707997-084641/child-2-1761382193107-sch1qh6oo	18	\N	\N	2025-10-25 08:49:53.108	2025-10-25 08:50:11.036	\N	f	f	69	48	1/4 запрессованные	32332065		Головка-бита Slotted 1.2x6.5 мм. 1/4” FORCE 32332065	null	2.16	\N	ARRIVED	IN_STORE	\N	2025-10-25 08:49:53.108	\N	0	0	\N	15	\N	MONOLITH	f	\N
81	32332065-20251025-114707997-084641/child-3-1761382193110-imht8o253	18	\N	\N	2025-10-25 08:49:53.111	2025-10-25 08:50:12.151	\N	f	f	69	48	1/4 запрессованные	32332065		Головка-бита Slotted 1.2x6.5 мм. 1/4” FORCE 32332065	null	2.16	\N	ARRIVED	IN_STORE	\N	2025-10-25 08:49:53.11	\N	0	0	\N	15	\N	MONOLITH	f	\N
71	321322-20251025-114657620-048311/child-1-1761382110135-cn61ihycj	19	\N	\N	2025-10-25 08:48:30.136	2025-10-25 08:50:03.851	\N	f	f	68	48	1/4 запрессованные	321322		Головка-бита Philips PH.2 1/4'' FORCE 321322	null	2.16	\N	ARRIVED	IN_STORE	\N	2025-10-25 08:48:30.135	\N	0	0	\N	18	\N	MONOLITH	f	\N
72	321322-20251025-114657620-048311/child-2-1761382110138-n46kzx4vd	19	\N	\N	2025-10-25 08:48:30.139	2025-10-25 08:50:04.64	\N	f	f	68	48	1/4 запрессованные	321322		Головка-бита Philips PH.2 1/4'' FORCE 321322	null	2.16	\N	ARRIVED	IN_STORE	\N	2025-10-25 08:48:30.138	\N	0	0	\N	18	\N	MONOLITH	f	\N
92	825206-20251025-122055305-915811	21	\N	\N	2025-10-25 09:20:55.306	2025-10-25 09:21:49.036	\N	f	f	\N	53	Съемник пистонов	825206		Съёмник пистонов обшивки изогнутый 6мм	null	\N	\N	SPROUTED	\N	2025-10-25 09:21:24.357	\N	\N	1	0	\N	22	\N	MONOLITH	f	\N
82	32332065-20251025-114707997-084641/child-4-1761382193113-bfscjktr2	18	\N	\N	2025-10-25 08:49:53.114	2025-10-25 08:50:12.67	\N	f	f	69	48	1/4 запрессованные	32332065		Головка-бита Slotted 1.2x6.5 мм. 1/4” FORCE 32332065	null	2.16	\N	ARRIVED	IN_STORE	\N	2025-10-25 08:49:53.113	\N	0	0	\N	15	\N	MONOLITH	f	\N
84	rf52508-20251025-115218413-193028	17	\N	\N	2025-10-25 08:52:18.414	2025-10-25 08:52:18.414	\N	f	f	\N	36	1/4 короткие	rf52508		Головка 8мм (6гр.), 1/4''	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	11	\N	MONOLITH	f	\N
83	rf52508-20251025-115124682-299232	17	\N	\N	2025-10-25 08:51:24.684	2025-10-25 08:52:18.421	\N	f	f	\N	36	1/4 короткие	rf52508		Головка 8мм (6гр.), 1/4''	null	\N	\N	SPROUTED	\N	2025-10-25 08:51:48.117	\N	\N	1	0	\N	11	\N	MONOLITH	f	\N
89	rf52508-20251025-115124682-299232/child-5-1761382338435-kap4wsrgt	17	3	2025-10-25 08:54:12.564	2025-10-25 08:52:18.436	2025-10-25 08:54:12.565	\N	f	f	83	36	1/4 короткие	rf52508		Головка 8мм (6гр.), 1/4''	null	1	\N	ARRIVED	SOLD	\N	2025-10-25 08:52:18.435	\N	0	0	\N	11	\N	MONOLITH	f	\N
85	rf52508-20251025-115124682-299232/child-1-1761382338422-2kd0m802r	17	\N	\N	2025-10-25 08:52:18.423	2025-10-25 08:52:28.161	\N	f	f	83	36	1/4 короткие	rf52508		Головка 8мм (6гр.), 1/4''	null	1	\N	ARRIVED	IN_STORE	\N	2025-10-25 08:52:18.422	\N	0	0	\N	11	\N	MONOLITH	f	\N
91	JCB-4458510-20251025-120007189-239053	20	\N	\N	2025-10-25 09:00:07.191	2025-10-25 09:00:07.191	\N	f	f	\N	50	6граней	JCB-4458510		Головка ударная глубокая 10мм (6гр.), 1/2''	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	21	\N	MONOLITH	f	\N
86	rf52508-20251025-115124682-299232/child-2-1761382338425-7m1h9e5sc	17	\N	\N	2025-10-25 08:52:18.427	2025-10-25 08:52:28.674	\N	f	f	83	36	1/4 короткие	rf52508		Головка 8мм (6гр.), 1/4''	null	1	\N	ARRIVED	IN_STORE	\N	2025-10-25 08:52:18.425	\N	0	0	\N	11	\N	MONOLITH	f	\N
87	rf52508-20251025-115124682-299232/child-3-1761382338428-em9daw7vu	17	\N	\N	2025-10-25 08:52:18.43	2025-10-25 08:52:29.807	\N	f	f	83	36	1/4 короткие	rf52508		Головка 8мм (6гр.), 1/4''	null	1	\N	ARRIVED	IN_STORE	\N	2025-10-25 08:52:18.429	\N	0	0	\N	11	\N	MONOLITH	f	\N
102	RF-1767555 Premium-20251025-124645491-373191	23	\N	\N	2025-10-25 09:46:45.493	2025-10-25 09:46:45.493	\N	f	f	\N	17	Torx_17675	RF-1767555 Premium		Бита TORX T55х75ммL	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	24	\N	MONOLITH	f	\N
94	825206-20251025-122055305-915811/child-1-1761384109038-youy5l8hq	21	\N	\N	2025-10-25 09:21:49.04	2025-10-25 09:22:03.451	\N	f	f	92	53	Съемник пистонов	825206		Съёмник пистонов обшивки изогнутый 6мм	null	5.52	\N	ARRIVED	IN_STORE	\N	2025-10-25 09:21:49.039	\N	0	0	\N	22	\N	MONOLITH	f	\N
100	FK-905M11-20251025-122705466-193345	22	\N	\N	2025-10-25 09:27:05.468	2025-10-25 09:27:05.468	\N	f	f	\N	54	ПЛАСТИКОВЫЕ НАБОРЫ	FK-905M11		Набор приспособлений (пласт.) для демонтажа внутренней обшивки салона 11пр.	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	23	\N	MONOLITH	f	\N
90	JCB-4458510-20251025-115932295-135816	20	10	2025-10-25 09:00:31.412	2025-10-25 08:59:32.298	2025-10-25 09:00:31.413	\N	f	f	\N	50	6граней	JCB-4458510		Головка ударная глубокая 10мм (6гр.), 1/2''	null	8	\N	ARRIVED	SOLD	2025-10-25 08:59:44.113	2025-10-25 09:00:07.203	\N	1	0	\N	21	\N	MONOLITH	f	\N
101	RF-1767555 Premium-20251025-124331429-970487	23	\N	\N	2025-10-25 09:43:31.431	2025-10-25 09:46:45.499	\N	f	f	\N	17	Torx_17675	RF-1767555 Premium		Бита TORX T55х75ммL	null	\N	\N	SPROUTED	\N	2025-10-25 09:44:07.39	\N	\N	1	0	\N	24	\N	MONOLITH	f	\N
93	825206-20251025-122149028-328801	21	\N	\N	2025-10-25 09:21:49.03	2025-10-25 09:21:49.03	\N	f	f	\N	53	Съемник пистонов	825206		Съёмник пистонов обшивки изогнутый 6мм	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	22	\N	MONOLITH	f	\N
95	825206-20251025-122055305-915811/child-2-1761384109043-nsnyf61k8	21	\N	\N	2025-10-25 09:21:49.044	2025-10-25 09:22:03.848	\N	f	f	92	53	Съемник пистонов	825206		Съёмник пистонов обшивки изогнутый 6мм	null	5.52	\N	ARRIVED	IN_STORE	\N	2025-10-25 09:21:49.043	\N	0	0	\N	22	\N	MONOLITH	f	\N
96	825206-20251025-122055305-915811/child-3-1761384109046-mk3wojyqf	21	10	2025-10-25 09:22:43.212	2025-10-25 09:21:49.047	2025-10-25 09:22:43.214	\N	f	f	92	53	Съемник пистонов	825206		Съёмник пистонов обшивки изогнутый 6мм	null	5.52	\N	ARRIVED	SOLD	\N	2025-10-25 09:21:49.047	\N	0	0	\N	22	\N	MONOLITH	f	\N
107	RF-1767555 Premium-20251025-124331429-970487/child-5-1761385605515-yzfm99vvw	23	5	2025-10-25 09:47:33.069	2025-10-25 09:46:45.516	2025-10-25 09:47:33.07	\N	f	f	101	17	Torx_17675	RF-1767555 Premium		Бита TORX T55х75ммL	null	2.4	\N	ARRIVED	SOLD	\N	2025-10-25 09:46:45.515	\N	0	0	\N	24	\N	MONOLITH	f	\N
88	rf52508-20251025-115124682-299232/child-4-1761382338432-tq51r8eid	17	3	2025-10-25 10:34:58.186	2025-10-25 08:52:18.433	2025-10-25 10:34:58.187	\N	f	f	83	36	1/4 короткие	rf52508		Головка 8мм (6гр.), 1/4''	null	1	\N	ARRIVED	SOLD	\N	2025-10-25 08:52:18.432	\N	0	0	\N	11	\N	MONOLITH	f	\N
105	RF-1767555 Premium-20251025-124331429-970487/child-3-1761385605509-ycboizujn	23	\N	\N	2025-10-25 09:46:45.509	2025-10-25 09:46:57.772	\N	f	f	101	17	Torx_17675	RF-1767555 Premium		Бита TORX T55х75ммL	null	2.4	\N	ARRIVED	IN_STORE	\N	2025-10-25 09:46:45.509	\N	0	0	\N	24	\N	MONOLITH	f	\N
97	825206-20251025-122055305-915811/child-4-1761384109050-0saudms0x	21	\N	\N	2025-10-25 09:21:49.051	2025-10-30 08:44:12.644	\N	f	f	92	53	Съемник пистонов	825206		Съёмник пистонов обшивки изогнутый 6мм	null	5.52	\N	ARRIVED	IN_STORE	\N	2025-10-25 09:21:49.05	\N	0	0	\N	22	\N	MONOLITH	f	\N
98	825206-20251025-122055305-915811/child-5-1761384109053-rxd51qj0k	21	\N	\N	2025-10-25 09:21:49.054	2025-10-30 08:44:13.363	\N	f	f	92	53	Съемник пистонов	825206		Съёмник пистонов обшивки изогнутый 6мм	null	5.52	\N	ARRIVED	IN_STORE	\N	2025-10-25 09:21:49.053	\N	0	0	\N	22	\N	MONOLITH	f	\N
103	RF-1767555 Premium-20251025-124331429-970487/child-1-1761385605501-q7v9a0faq	23	\N	\N	2025-10-25 09:46:45.502	2025-10-25 09:46:56.375	\N	f	f	101	17	Torx_17675	RF-1767555 Premium		Бита TORX T55х75ммL	null	2.4	\N	ARRIVED	IN_STORE	\N	2025-10-25 09:46:45.501	\N	0	0	\N	24	\N	MONOLITH	f	\N
104	RF-1767555 Premium-20251025-124331429-970487/child-2-1761385605505-j0zxk3ksj	23	\N	\N	2025-10-25 09:46:45.506	2025-10-25 09:46:56.882	\N	f	f	101	17	Torx_17675	RF-1767555 Premium		Бита TORX T55х75ммL	null	2.4	\N	ARRIVED	IN_STORE	\N	2025-10-25 09:46:45.505	\N	0	0	\N	24	\N	MONOLITH	f	\N
106	RF-1767555 Premium-20251025-124331429-970487/child-4-1761385605512-is58j81gf	23	\N	\N	2025-10-25 09:46:45.513	2025-10-25 09:46:58.291	\N	f	f	101	17	Torx_17675	RF-1767555 Premium		Бита TORX T55х75ммL	null	2.4	\N	ARRIVED	IN_STORE	\N	2025-10-25 09:46:45.512	\N	0	0	\N	24	\N	MONOLITH	f	\N
109	JCB-4167-5MPB-20251025-125216216-009324	24	\N	\N	2025-10-25 09:52:16.218	2025-10-25 09:52:16.218	\N	f	f	\N	56	1/2" ударные удлиненные	JCB-4167-5MPB		Набор головок ударных глубоких 16пр.,1/2''6гр.(10,12-19,21,22,24,27,30,32,36мм), в металлическом кейсе	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	25	\N	MONOLITH	f	\N
119	KACN160B-20251025-151236444-534449	28	\N	\N	2025-10-25 12:12:36.446	2025-10-25 12:12:36.446	\N	f	f	\N	66	ШАРНИР-УДАРНЫЙ	KACN160B		Шарнир ударный 1/2"х62мм TOPTUL	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	33	\N	MONOLITH	f	\N
113	800 410-20251025-133732025-597901	26	45	2025-10-25 10:38:43.747	2025-10-25 10:37:32.026	2025-10-25 10:38:43.748	\N	f	f	\N	61	ременной	800 410		Съёмник масляных фильтров ременной Ø60-140 мм	null	35.46	\N	ARRIVED	SOLD	2025-10-25 10:37:49.158	2025-10-25 10:38:18.007	\N	1	0	\N	28	\N	MONOLITH	f	\N
118	KACN160B-20251025-151139405-456655	28	\N	\N	2025-10-25 12:11:39.407	2025-10-25 12:12:36.452	\N	f	f	\N	66	ШАРНИР-УДАРНЫЙ	KACN160B		Шарнир ударный 1/2"х62мм TOPTUL	null	\N	\N	SPROUTED	\N	2025-10-25 12:12:04.981	\N	\N	1	0	\N	33	\N	MONOLITH	f	\N
115	800 410-20251025-133951395-489948	26	\N	\N	2025-10-25 10:39:51.397	2025-10-25 10:39:51.397	\N	f	f	\N	61	ременной	800 410		Съёмник масляных фильтров ременной Ø60-140 мм	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	28	\N	MONOLITH	f	\N
108	JCB-4167-5MPB-20251025-125119209-577380	24	120	2025-10-25 09:52:48.135	2025-10-25 09:51:19.21	2025-10-25 09:52:48.136	\N	f	f	\N	56	1/2" ударные удлиненные	JCB-4167-5MPB		Набор головок ударных глубоких 16пр.,1/2''6гр.(10,12-19,21,22,24,27,30,32,36мм), в металлическом кейсе	null	81.36	\N	ARRIVED	SOLD	2025-10-25 09:51:38.668	2025-10-25 09:52:16.23	\N	1	0	\N	25	\N	MONOLITH	f	\N
110	jcb52510-20251025-133314803-271633	25	\N	\N	2025-10-25 10:33:14.805	2025-10-25 10:33:14.805	\N	f	f	\N	36	1/4 короткие	jcb52510		Головка 10мм (6гр.), 1/4''	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	26	\N	MONOLITH	f	\N
112	jcb52510-20251025-133426397-082264	25	\N	\N	2025-10-25 10:34:26.399	2025-10-25 10:34:26.399	\N	f	f	\N	36	1/4 короткие	jcb52510		Головка 10мм (6гр.), 1/4''	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	26	\N	MONOLITH	f	\N
99	FK-905M11-20251025-122633062-026399	22	\N	\N	2025-10-25 09:26:33.064	2025-10-25 10:40:15.322	\N	f	f	\N	54	ПЛАСТИКОВЫЕ НАБОРЫ	FK-905M11		Набор приспособлений (пласт.) для демонтажа внутренней обшивки салона 11пр.	null	16.2	\N	ARRIVED	IN_STORE	2025-10-25 09:26:44.968	2025-10-25 09:27:05.479	\N	1	0	\N	23	\N	MONOLITH	f	\N
111	jcb52510-20251025-133343358-369602	25	3	2025-10-25 10:34:47.007	2025-10-25 10:33:43.359	2025-10-25 10:34:47.008	\N	f	f	\N	36	1/4 короткие	jcb52510		Головка 10мм (6гр.), 1/4''	null	1.5	\N	ARRIVED	SOLD	2025-10-25 10:33:58.978	2025-10-25 10:34:26.411	\N	1	0	\N	26	\N	MONOLITH	f	\N
127	40290-20251025-151659623-522743/child-4-1761394683720-3iof8diut	29	17	2025-10-25 12:18:38.771	2025-10-25 12:18:03.721	2025-10-25 12:18:38.772	\N	f	f	122	69	лямбда	40290		Головка разрезная для монтажа кислородного датчика 22 мм ½	null	12.42	\N	ARRIVED	SOLD	\N	2025-10-25 12:18:03.72	\N	0	0	\N	35	\N	MONOLITH	f	\N
122	40290-20251025-151659623-522743	29	\N	\N	2025-10-25 12:16:59.625	2025-10-25 12:18:03.709	\N	f	f	\N	69	лямбда	40290		Головка разрезная для монтажа кислородного датчика 22 мм ½	null	\N	\N	SPROUTED	\N	2025-10-25 12:17:15.119	\N	\N	1	0	\N	35	\N	MONOLITH	f	\N
116	FK-933T1-12P-20251025-134723126-540473	27	30	2025-10-25 12:08:26.955	2025-10-25 10:47:23.127	2025-10-25 12:08:26.956	\N	f	f	\N	65	шпильки	FK-933T1-12P		Болт к набору для замены сайлентблоков М12	null	19.5	\N	ARRIVED	SOLD	2025-10-25 10:47:37.745	2025-10-25 12:07:49.262	\N	1	0	\N	29	\N	MONOLITH	f	\N
121	KACN160B-20251025-151139405-456655/child-2-1761394356456-mie08eeqx	28	30	2025-10-25 12:13:32.626	2025-10-25 12:12:36.457	2025-10-25 12:13:32.627	\N	f	f	118	66	ШАРНИР-УДАРНЫЙ	KACN160B		Шарнир ударный 1/2"х62мм TOPTUL	null	21.33	\N	ARRIVED	SOLD	\N	2025-10-25 12:12:36.456	\N	0	0	\N	33	\N	MONOLITH	f	\N
124	40290-20251025-151659623-522743/child-1-1761394683711-m0ljfxceq	29	\N	\N	2025-10-25 12:18:03.712	2025-10-25 12:18:18.042	\N	f	f	122	69	лямбда	40290		Головка разрезная для монтажа кислородного датчика 22 мм ½	null	12.42	\N	ARRIVED	IN_STORE	\N	2025-10-25 12:18:03.711	\N	0	0	\N	35	\N	MONOLITH	f	\N
120	KACN160B-20251025-151139405-456655/child-1-1761394356453-h829s3b1d	28	30	2025-10-29 10:11:53.925	2025-10-25 12:12:36.454	2025-10-29 10:11:53.926	\N	f	f	118	66	ШАРНИР-УДАРНЫЙ	KACN160B		Шарнир ударный 1/2"х62мм TOPTUL	null	21.33	\N	ARRIVED	SOLD	\N	2025-10-25 12:12:36.453	\N	0	0	\N	33	\N	MONOLITH	f	\N
125	40290-20251025-151659623-522743/child-2-1761394683714-e21dhwn9t	29	\N	\N	2025-10-25 12:18:03.715	2025-10-25 12:18:19.714	\N	f	f	122	69	лямбда	40290		Головка разрезная для монтажа кислородного датчика 22 мм ½	null	12.42	\N	ARRIVED	IN_STORE	\N	2025-10-25 12:18:03.714	\N	0	0	\N	35	\N	MONOLITH	f	\N
129	622019-20251025-153045137-629902	30	\N	\N	2025-10-25 12:30:45.139	2025-10-25 12:30:45.139	\N	f	f	\N	7	12-граней	622019		Головка двенадцатигранная 19мм 1/2"	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	36	\N	MONOLITH	f	\N
128	622019-20251025-152131315-439503	30	\N	\N	2025-10-25 12:21:31.317	2025-10-25 12:30:45.152	\N	f	f	\N	7	12-граней	622019		Головка двенадцатигранная 19мм 1/2"	null	\N	\N	SPROUTED	\N	2025-10-25 12:21:55.972	\N	\N	1	0	\N	36	\N	MONOLITH	f	\N
117	FK-933T1-12P-20251025-150749248-082852	27	\N	\N	2025-10-25 12:07:49.25	2025-10-28 09:59:05.291	\N	f	f	\N	65	шпильки	FK-933T1-12P		Болт к набору для замены сайлентблоков М12	null	\N	\N	SPROUTED	\N	2025-10-28 09:58:29.783	\N	\N	1	0	\N	29	\N	MONOLITH	f	\N
114	800 410-20251025-133818002-310526	26	\N	\N	2025-10-25 10:38:18.004	2025-10-30 08:42:27.467	\N	f	f	\N	61	ременной	800 410		Съёмник масляных фильтров ременной Ø60-140 мм	null	35.46	\N	ARRIVED	IN_STORE	2025-10-25 10:39:29.39	2025-10-25 10:39:51.4	\N	1	0	\N	28	\N	MONOLITH	f	\N
123	40290-20251025-151803702-967255	29	\N	\N	2025-10-25 12:18:03.704	2025-10-30 08:41:50.789	\N	f	f	\N	69	лямбда	40290		Головка разрезная для монтажа кислородного датчика 22 мм ½	null	12.42	\N	ARRIVED	IN_STORE	2025-10-30 08:41:19.207	2025-10-30 08:41:49.523	\N	1	0	\N	35	\N	MONOLITH	f	\N
142	JCB-41082-5-20251027-141241935-816839	33	\N	\N	2025-10-27 11:12:41.936	2025-10-27 11:12:41.936	\N	f	f	\N	81	1/4" и 1/2"	JCB-41082-5		Набор инструментов 108пр.1/4''&1/2''(6-гран)(4-32мм)	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	39	\N	MONOLITH	f	\N
138	F-5161MP-20251027-134904420-175070	32	\N	\N	2025-10-27 10:49:04.422	2025-10-27 10:49:04.422	\N	f	f	\N	75	Комбинированные наборы	F-5161MP		Набор ключей комбинированных, 16пр.(6-19, 22, 24мм), в пластиковом держателе	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	38	\N	MONOLITH	f	\N
133	622019-20251025-152131315-439503/child-4-1761395445165-dt3t619l0	30	\N	\N	2025-10-25 12:30:45.167	2025-10-25 12:30:58.463	\N	f	f	128	7	12-граней	622019		Головка двенадцатигранная 19мм 1/2"	null	2.88	\N	ARRIVED	IN_STORE	\N	2025-10-25 12:30:45.165	\N	0	0	\N	36	\N	MONOLITH	f	\N
137	F-5161MP-20251027-134814779-918326	32	\N	\N	2025-10-27 10:48:14.781	2025-10-27 10:49:04.428	\N	f	f	\N	75	Комбинированные наборы	F-5161MP		Набор ключей комбинированных, 16пр.(6-19, 22, 24мм), в пластиковом держателе	null	\N	\N	SPROUTED	\N	2025-10-27 10:48:35.503	\N	\N	1	0	\N	38	\N	MONOLITH	f	\N
141	JCB-41082-5-20251027-141159063-689910	33	\N	\N	2025-10-27 11:11:59.065	2025-10-27 11:12:41.943	\N	f	f	\N	81	1/4" и 1/2"	JCB-41082-5		Набор инструментов 108пр.1/4''&1/2''(6-гран)(4-32мм)	null	\N	\N	SPROUTED	\N	2025-10-27 11:12:18.473	\N	\N	1	0	\N	39	\N	MONOLITH	f	\N
131	622019-20251025-152131315-439503/child-2-1761395445159-m1jlf5upg	30	\N	\N	2025-10-25 12:30:45.16	2025-10-25 12:31:01.492	\N	f	f	128	7	12-граней	622019		Головка двенадцатигранная 19мм 1/2"	null	2.88	\N	ARRIVED	IN_STORE	\N	2025-10-25 12:30:45.159	\N	0	0	\N	36	\N	MONOLITH	f	\N
130	622019-20251025-152131315-439503/child-1-1761395445154-dsjvef090	30	\N	\N	2025-10-25 12:30:45.156	2025-10-25 12:31:02.233	\N	f	f	128	7	12-граней	622019		Головка двенадцатигранная 19мм 1/2"	null	2.88	\N	ARRIVED	IN_STORE	\N	2025-10-25 12:30:45.155	\N	0	0	\N	36	\N	MONOLITH	f	\N
132	622019-20251025-152131315-439503/child-3-1761395445162-c2uukr7qs	30	5	2025-10-25 12:31:22.521	2025-10-25 12:30:45.163	2025-10-25 12:31:22.522	\N	f	f	128	7	12-граней	622019		Головка двенадцатигранная 19мм 1/2"	null	2.88	\N	ARRIVED	SOLD	\N	2025-10-25 12:30:45.162	\N	0	0	\N	36	\N	MONOLITH	f	\N
134	622021-20251025-154535185-883388	2	\N	\N	2025-10-25 12:45:35.188	2025-10-25 12:45:35.188	\N	f	f	\N	7	12-граней	622021		Головка двенадцатигранная 21 мм 1/2"	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	2	\N	MONOLITH	f	\N
432	40290-20251030-114149511-296297	29	\N	\N	2025-10-30 08:41:49.512	2025-10-30 08:41:49.512	\N	f	f	\N	69	лямбда	40290		Головка разрезная для монтажа кислородного датчика 22 мм ½	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	35	\N	MONOLITH	f	\N
140	F-5161MP-20251027-134814779-918326/child-2-1761562144433-1flc0wvc5	32	55	2025-10-27 10:49:44.27	2025-10-27 10:49:04.434	2025-10-27 10:49:44.271	\N	f	f	137	75	Комбинированные наборы	F-5161MP		Набор ключей комбинированных, 16пр.(6-19, 22, 24мм), в пластиковом держателе	null	35.58	\N	ARRIVED	SOLD	\N	2025-10-27 10:49:04.433	\N	0	0	\N	38	\N	MONOLITH	f	\N
135	rf802222-20251025-155022087-196801	31	20	2025-10-25 12:51:17.987	2025-10-25 12:50:22.088	2025-10-25 12:51:17.988	\N	f	f	\N	71	1/4" Трещотки	rf802222		Трещотка реверсивная усиленная изогнутая с резиновой ручкой 1/4''(72зуб.)	null	14	\N	ARRIVED	SOLD	2025-10-25 12:50:32.887	2025-10-25 12:50:52.845	\N	1	0	\N	37	\N	MONOLITH	f	\N
143	JCB-41082-5-20251027-141159063-689910/child-1-1761563561945-7rky9u701	33	140	2025-10-27 11:13:09.957	2025-10-27 11:12:41.946	2025-10-27 11:13:09.958	\N	f	f	141	81	1/4" и 1/2"	JCB-41082-5		Набор инструментов 108пр.1/4''&1/2''(6-гран)(4-32мм)	null	105	\N	ARRIVED	SOLD	\N	2025-10-27 11:12:41.945	\N	0	0	\N	39	\N	MONOLITH	f	\N
146	80634-20251027-141753607-238276	34	\N	\N	2025-10-27 11:17:53.609	2025-10-28 08:11:17.344	\N	f	f	\N	82	БЕГУНКИ (Адаптер-переходник 3/8''(F)x1/2''(M))	80634		Адаптер-переходник 3/8''(F)x1/2''(M)	null	\N	\N	CANDIDATE	\N	\N	\N	\N	0	0	\N	40	\N	MONOLITH	f	\N
145	80634-20251027-141709789-809795	34	\N	\N	2025-10-27 11:17:09.79	2025-10-27 11:17:53.614	\N	f	f	\N	82	БЕГУНКИ (Адаптер-переходник 3/8''(F)x1/2''(M))	80634		Адаптер-переходник 3/8''(F)x1/2''(M)	null	\N	\N	SPROUTED	\N	2025-10-27 11:17:20.722	\N	\N	1	0	\N	40	\N	MONOLITH	f	\N
139	F-5161MP-20251027-134814779-918326/child-1-1761562144429-5r70o6rpj	32	50	2025-10-29 10:52:53.021	2025-10-27 10:49:04.43	2025-10-29 10:52:53.022	\N	f	f	137	75	Комбинированные наборы	F-5161MP		Набор ключей комбинированных, 16пр.(6-19, 22, 24мм), в пластиковом держателе	null	35.58	\N	ARRIVED	SOLD	\N	2025-10-27 10:49:04.429	\N	0	0	\N	38	\N	MONOLITH	f	\N
136	rf802222-20251025-155052831-391411	31	\N	\N	2025-10-25 12:50:52.833	2025-10-29 08:20:17.853	\N	f	f	\N	71	1/4" Трещотки	rf802222		Трещотка реверсивная усиленная изогнутая с резиновой ручкой 1/4''(72зуб.)	null	\N	\N	SPROUTED	\N	2025-10-29 08:19:41.114	\N	\N	1	0	\N	37	\N	MONOLITH	f	\N
148	80634-20251027-141709789-809795/child-2-1761563873620-5ppza8pxu	34	\N	\N	2025-10-27 11:17:53.621	2025-11-02 10:22:35.731	\N	f	f	145	82	БЕГУНКИ (Адаптер-переходник 3/8''(F)x1/2''(M))	80634		Адаптер-переходник 3/8''(F)x1/2''(M)	null	5.1	\N	ARRIVED	IN_STORE	\N	2025-10-27 11:17:53.62	\N	0	0	\N	40	\N	MONOLITH	f	\N
149	80634-20251027-141709789-809795/child-3-1761563873623-5c9ctr9sk	34	\N	\N	2025-10-27 11:17:53.624	2025-11-02 10:22:37.823	\N	f	f	145	82	БЕГУНКИ (Адаптер-переходник 3/8''(F)x1/2''(M))	80634		Адаптер-переходник 3/8''(F)x1/2''(M)	null	5.1	\N	ARRIVED	IN_STORE	\N	2025-10-27 11:17:53.623	\N	0	0	\N	40	\N	MONOLITH	f	\N
150	80634-20251027-141709789-809795/child-4-1761563873626-omd6jx76h	34	\N	\N	2025-10-27 11:17:53.627	2025-11-02 10:22:39.794	\N	f	f	145	82	БЕГУНКИ (Адаптер-переходник 3/8''(F)x1/2''(M))	80634		Адаптер-переходник 3/8''(F)x1/2''(M)	null	5.1	\N	ARRIVED	IN_STORE	\N	2025-10-27 11:17:53.626	\N	0	0	\N	40	\N	MONOLITH	f	\N
151	80634-20251027-141709789-809795/child-5-1761563873629-mkhmvf44n	34	\N	\N	2025-10-27 11:17:53.63	2025-11-02 10:22:41.813	\N	f	f	145	82	БЕГУНКИ (Адаптер-переходник 3/8''(F)x1/2''(M))	80634		Адаптер-переходник 3/8''(F)x1/2''(M)	null	5.1	\N	ARRIVED	IN_STORE	\N	2025-10-27 11:17:53.629	\N	0	0	\N	40	\N	MONOLITH	f	\N
152	80634-20251027-141709789-809795/child-6-1761563873632-ah6f6qbg5	34	\N	\N	2025-10-27 11:17:53.633	2025-11-02 10:22:43.459	\N	f	f	145	82	БЕГУНКИ (Адаптер-переходник 3/8''(F)x1/2''(M))	80634		Адаптер-переходник 3/8''(F)x1/2''(M)	null	5.1	\N	ARRIVED	IN_STORE	\N	2025-10-27 11:17:53.632	\N	0	0	\N	40	\N	MONOLITH	f	\N
165	FK-44836-20251027-142309255-341198/child-6-1761564235192-dsmed9rix	35	\N	\N	2025-10-27 11:23:55.193	2025-10-27 11:24:14.37	\N	f	f	158	86	12гр	FK-44836		Головка ударная 36мм (12гр.), 1/2''	null	5.61	\N	ARRIVED	IN_STORE	\N	2025-10-27 11:23:55.192	\N	0	0	\N	41	\N	MONOLITH	f	\N
147	80634-20251027-141709789-809795/child-1-1761563873617-yci4y87t9	34	10	2025-10-27 11:18:32.064	2025-10-27 11:17:53.618	2025-10-27 11:18:32.065	\N	f	f	145	82	БЕГУНКИ (Адаптер-переходник 3/8''(F)x1/2''(M))	80634		Адаптер-переходник 3/8''(F)x1/2''(M)	null	5.1	\N	ARRIVED	SOLD	\N	2025-10-27 11:17:53.617	\N	0	0	\N	40	\N	MONOLITH	f	\N
162	FK-44836-20251027-142309255-341198/child-3-1761564235184-2h8kawsym	35	\N	\N	2025-10-27 11:23:55.185	2025-10-27 11:24:12.257	\N	f	f	158	86	12гр	FK-44836		Головка ударная 36мм (12гр.), 1/2''	null	5.61	\N	ARRIVED	IN_STORE	\N	2025-10-27 11:23:55.184	\N	0	0	\N	41	\N	MONOLITH	f	\N
158	FK-44836-20251027-142309255-341198	35	\N	\N	2025-10-27 11:23:09.257	2025-10-27 11:23:55.176	\N	f	f	\N	86	12гр	FK-44836		Головка ударная 36мм (12гр.), 1/2''	null	\N	\N	SPROUTED	\N	2025-10-27 11:23:25.705	\N	\N	1	0	\N	41	\N	MONOLITH	f	\N
171	660019-20251027-142636677-868282/child-2-1761564460368-fry3g3vje	36	9	2025-10-27 11:28:40.527	2025-10-27 11:27:40.369	2025-10-27 11:28:40.528	\N	f	f	168	85	6гр	660019		Головка ударная шестигранная 19 мм 1/2"	null	5.16	\N	ARRIVED	SOLD	\N	2025-10-27 11:27:40.368	\N	0	0	\N	42	\N	MONOLITH	f	\N
169	660019-20251027-142740347-011634	36	\N	\N	2025-10-27 11:27:40.349	2025-10-27 11:27:40.349	\N	f	f	\N	85	6гр	660019		Головка ударная шестигранная 19 мм 1/2"	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	42	\N	MONOLITH	f	\N
160	FK-44836-20251027-142309255-341198/child-1-1761564235177-56qyv8xis	35	\N	\N	2025-10-27 11:23:55.178	2025-10-27 11:24:10.326	\N	f	f	158	86	12гр	FK-44836		Головка ударная 36мм (12гр.), 1/2''	null	5.61	\N	ARRIVED	IN_STORE	\N	2025-10-27 11:23:55.177	\N	0	0	\N	41	\N	MONOLITH	f	\N
163	FK-44836-20251027-142309255-341198/child-4-1761564235187-wzpwtoa3v	35	\N	\N	2025-10-27 11:23:55.187	2025-10-27 11:24:13.12	\N	f	f	158	86	12гр	FK-44836		Головка ударная 36мм (12гр.), 1/2''	null	5.61	\N	ARRIVED	IN_STORE	\N	2025-10-27 11:23:55.187	\N	0	0	\N	41	\N	MONOLITH	f	\N
170	660019-20251027-142636677-868282/child-1-1761564460365-4uj6uks6f	36	12	2025-11-02 11:19:57.649	2025-10-27 11:27:40.366	2025-11-02 11:19:57.66	\N	f	f	168	85	6гр	660019		Головка ударная шестигранная 19 мм 1/2"	null	5.16	\N	ARRIVED	SOLD	\N	2025-10-27 11:27:40.365	\N	0	0	\N	42	\N	MONOLITH	f	\N
161	FK-44836-20251027-142309255-341198/child-2-1761564235181-hd88xa4f5	35	\N	\N	2025-10-27 11:23:55.182	2025-10-27 11:24:10.882	\N	f	f	158	86	12гр	FK-44836		Головка ударная 36мм (12гр.), 1/2''	null	5.61	\N	ARRIVED	IN_STORE	\N	2025-10-27 11:23:55.181	\N	0	0	\N	41	\N	MONOLITH	f	\N
168	660019-20251027-142636677-868282	36	\N	\N	2025-10-27 11:26:36.678	2025-10-27 11:27:40.363	\N	f	f	\N	85	6гр	660019		Головка ударная шестигранная 19 мм 1/2"	null	\N	\N	SPROUTED	\N	2025-10-27 11:26:54.188	\N	\N	1	0	\N	42	\N	MONOLITH	f	\N
164	FK-44836-20251027-142309255-341198/child-5-1761564235189-qlfgygc3d	35	\N	\N	2025-10-27 11:23:55.19	2025-10-27 11:24:13.79	\N	f	f	158	86	12гр	FK-44836		Головка ударная 36мм (12гр.), 1/2''	null	5.61	\N	ARRIVED	IN_STORE	\N	2025-10-27 11:23:55.189	\N	0	0	\N	41	\N	MONOLITH	f	\N
159	FK-44836-20251027-142355160-330328	35	\N	\N	2025-10-27 11:23:55.161	2025-10-28 08:19:21.377	\N	f	f	\N	86	12гр	FK-44836		Головка ударная 36мм (12гр.), 1/2''	null	\N	\N	CANDIDATE	\N	\N	\N	\N	0	0	\N	41	\N	MONOLITH	f	\N
167	FK-44836-20251027-142309255-341198/child-8-1761564235198-xvh6flwis	35	12	2025-10-27 11:24:32.308	2025-10-27 11:23:55.199	2025-10-27 11:24:32.309	\N	f	f	158	86	12гр	FK-44836		Головка ударная 36мм (12гр.), 1/2''	null	5.61	\N	ARRIVED	SOLD	\N	2025-10-27 11:23:55.198	\N	0	0	\N	41	\N	MONOLITH	f	\N
172	ABG-20-20251027-143133863-477235	37	\N	\N	2025-10-27 11:31:33.867	2025-10-27 11:32:00.922	\N	f	f	\N	87	продувочные	ABG-20		Пистолет продувочный c комплектом сопел ECO ABG-20	null	\N	\N	SPROUTED	\N	2025-10-27 11:31:44.36	\N	\N	1	0	\N	43	\N	MONOLITH	f	\N
177	ABG-20-20251027-143133863-477235/child-4-1761564720933-ahj1wcikm	37	\N	\N	2025-10-27 11:32:00.934	2025-10-27 11:32:00.934	\N	f	f	172	87	продувочные	ABG-20		Пистолет продувочный c комплектом сопел ECO ABG-20	null	11.63	\N	IN_REQUEST	\N	\N	2025-10-27 11:32:00.933	\N	0	0	\N	43	\N	MONOLITH	f	\N
178	ABG-20-20251027-143133863-477235/child-5-1761564720936-mws1rbpb3	37	\N	\N	2025-10-27 11:32:00.937	2025-10-27 11:32:00.937	\N	f	f	172	87	продувочные	ABG-20		Пистолет продувочный c комплектом сопел ECO ABG-20	null	11.63	\N	IN_REQUEST	\N	\N	2025-10-27 11:32:00.936	\N	0	0	\N	43	\N	MONOLITH	f	\N
173	ABG-20-20251027-143200906-197351	37	\N	\N	2025-10-27 11:32:00.908	2025-10-28 11:14:05.292	\N	f	f	\N	87	продувочные	ABG-20		Пистолет продувочный c комплектом сопел ECO ABG-20	null	\N	\N	CANDIDATE	\N	\N	\N	\N	0	0	\N	43	\N	MONOLITH	f	\N
166	FK-44836-20251027-142309255-341198/child-7-1761564235195-vmhw0u2wi	35	12	2025-10-29 11:07:13.03	2025-10-27 11:23:55.196	2025-10-29 11:07:13.031	\N	f	f	158	86	12гр	FK-44836		Головка ударная 36мм (12гр.), 1/2''	null	5.61	\N	ARRIVED	SOLD	\N	2025-10-27 11:23:55.195	\N	0	0	\N	41	\N	MONOLITH	f	\N
156	80634-20251027-141709789-809795/child-10-1761563873643-clvjy75us	34	\N	\N	2025-10-27 11:17:53.644	2025-10-30 08:40:13.385	\N	f	f	145	82	БЕГУНКИ (Адаптер-переходник 3/8''(F)x1/2''(M))	80634		Адаптер-переходник 3/8''(F)x1/2''(M)	null	5.1	\N	ARRIVED	IN_STORE	\N	2025-10-27 11:17:53.643	\N	0	0	\N	40	\N	MONOLITH	f	\N
155	80634-20251027-141709789-809795/child-9-1761563873641-ozke1kfvq	34	\N	\N	2025-10-27 11:17:53.642	2025-10-30 08:40:14.074	\N	f	f	145	82	БЕГУНКИ (Адаптер-переходник 3/8''(F)x1/2''(M))	80634		Адаптер-переходник 3/8''(F)x1/2''(M)	null	5.1	\N	ARRIVED	IN_STORE	\N	2025-10-27 11:17:53.641	\N	0	0	\N	40	\N	MONOLITH	f	\N
154	80634-20251027-141709789-809795/child-8-1761563873638-fof9idavr	34	\N	\N	2025-10-27 11:17:53.639	2025-10-30 08:40:14.694	\N	f	f	145	82	БЕГУНКИ (Адаптер-переходник 3/8''(F)x1/2''(M))	80634		Адаптер-переходник 3/8''(F)x1/2''(M)	null	5.1	\N	ARRIVED	IN_STORE	\N	2025-10-27 11:17:53.638	\N	0	0	\N	40	\N	MONOLITH	f	\N
175	ABG-20-20251027-143133863-477235/child-2-1761564720927-4o4iq57sk	37	\N	\N	2025-10-27 11:32:00.928	2025-11-02 10:22:46.675	\N	f	f	172	87	продувочные	ABG-20		Пистолет продувочный c комплектом сопел ECO ABG-20	null	11.63	\N	ARRIVED	IN_STORE	\N	2025-10-27 11:32:00.927	\N	0	0	\N	43	\N	MONOLITH	f	\N
176	ABG-20-20251027-143133863-477235/child-3-1761564720930-6qgryyfvz	37	\N	\N	2025-10-27 11:32:00.931	2025-11-02 10:22:50.625	\N	f	f	172	87	продувочные	ABG-20		Пистолет продувочный c комплектом сопел ECO ABG-20	null	11.63	\N	ARRIVED	IN_STORE	\N	2025-10-27 11:32:00.93	\N	0	0	\N	43	\N	MONOLITH	f	\N
174	ABG-20-20251027-143133863-477235/child-1-1761564720923-t4qtrrfpl	37	18	2025-10-27 11:32:50.619	2025-10-27 11:32:00.925	2025-10-27 11:32:50.621	\N	f	f	172	87	продувочные	ABG-20		Пистолет продувочный c комплектом сопел ECO ABG-20	null	11.63	\N	ARRIVED	SOLD	\N	2025-10-27 11:32:00.923	\N	0	0	\N	43	\N	MONOLITH	f	\N
192	ST5025-20251028-124143714-935747	40	\N	\N	2025-10-28 09:41:43.716	2025-10-28 11:13:58.743	\N	f	f	\N	95	Щетки ручные	ST5025		Щетка латунированная STARTUL STANDART (ST5025) (проволочная, пластмассовая рукоятка)	null	\N	\N	CANDIDATE	\N	\N	\N	\N	0	0	\N	50	\N	MONOLITH	f	\N
180	YT-38510-20251028-122449531-783856	38	\N	\N	2025-10-28 09:24:49.533	2025-10-28 09:24:49.533	\N	f	f	\N	88	свечные головки	YT-38510		Головка свечная 3/8" 14мм L63мм CrV "Yato"	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	44	\N	MONOLITH	f	\N
179	YT-38510-20251028-122215666-534262	38	\N	\N	2025-10-28 09:22:15.668	2025-10-28 09:24:49.54	\N	f	f	\N	88	свечные головки	YT-38510		Головка свечная 3/8" 14мм L63мм CrV "Yato"	null	\N	\N	SPROUTED	\N	2025-10-28 09:22:40.254	\N	\N	1	0	\N	44	\N	MONOLITH	f	\N
185	YT-38510-20251028-122215666-534262/child-5-1761643489556-mhmjwioqx	38	15	2025-10-28 09:25:45.888	2025-10-28 09:24:49.556	2025-10-28 09:25:45.89	\N	f	f	179	88	свечные головки	YT-38510		Головка свечная 3/8" 14мм L63мм CrV "Yato"	null	7.08	\N	ARRIVED	SOLD	\N	2025-10-28 09:24:49.556	\N	0	0	\N	44	\N	MONOLITH	f	\N
181	YT-38510-20251028-122215666-534262/child-1-1761643489541-hnow4yf6a	38	\N	\N	2025-10-28 09:24:49.543	2025-10-28 09:25:00.452	\N	f	f	179	88	свечные головки	YT-38510		Головка свечная 3/8" 14мм L63мм CrV "Yato"	null	7.08	\N	ARRIVED	IN_STORE	\N	2025-10-28 09:24:49.542	\N	0	0	\N	44	\N	MONOLITH	f	\N
182	YT-38510-20251028-122215666-534262/child-2-1761643489546-370dfwfxi	38	\N	\N	2025-10-28 09:24:49.547	2025-10-28 09:25:01.16	\N	f	f	179	88	свечные головки	YT-38510		Головка свечная 3/8" 14мм L63мм CrV "Yato"	null	7.08	\N	ARRIVED	IN_STORE	\N	2025-10-28 09:24:49.546	\N	0	0	\N	44	\N	MONOLITH	f	\N
191	ST5025-20251028-124048225-422533	40	\N	\N	2025-10-28 09:40:48.227	2025-10-28 09:41:43.732	\N	f	f	\N	95	Щетки ручные	ST5025		Щетка латунированная STARTUL STANDART (ST5025) (проволочная, пластмассовая рукоятка)	null	\N	\N	SPROUTED	\N	2025-10-28 09:41:02.425	\N	\N	1	0	\N	50	\N	MONOLITH	f	\N
183	YT-38510-20251028-122215666-534262/child-3-1761643489549-8kkwj2igq	38	\N	\N	2025-10-28 09:24:49.55	2025-10-28 09:25:02.24	\N	f	f	179	88	свечные головки	YT-38510		Головка свечная 3/8" 14мм L63мм CrV "Yato"	null	7.08	\N	ARRIVED	IN_STORE	\N	2025-10-28 09:24:49.549	\N	0	0	\N	44	\N	MONOLITH	f	\N
184	YT-38510-20251028-122215666-534262/child-4-1761643489552-lxue2vsz2	38	\N	\N	2025-10-28 09:24:49.553	2025-10-28 09:25:02.996	\N	f	f	179	88	свечные головки	YT-38510		Головка свечная 3/8" 14мм L63мм CrV "Yato"	null	7.08	\N	ARRIVED	IN_STORE	\N	2025-10-28 09:24:49.552	\N	0	0	\N	44	\N	MONOLITH	f	\N
186	ER-53825-20251028-123407115-650722	39	10	2025-10-28 09:35:47.796	2025-10-28 09:34:07.117	2025-10-28 09:35:47.796	\N	f	f	\N	91	3/8-вороток-Гобразный	ER-53825		Вороток 3/8" DR Г-образный 250мм на держателе ЭВРИКА	null	7.74	\N	ARRIVED	SOLD	2025-10-28 09:34:19.329	2025-10-28 09:34:54.87	\N	1	0	\N	45	\N	MONOLITH	f	\N
188	ER-53825-20251028-123645307-008589	39	\N	\N	2025-10-28 09:36:45.309	2025-10-28 09:36:45.309	\N	f	f	\N	91	3/8-вороток-Гобразный	ER-53825		Вороток 3/8" DR Г-образный 250мм на держателе ЭВРИКА	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	45	\N	MONOLITH	f	\N
187	ER-53825-20251028-123454865-226300	39	\N	\N	2025-10-28 09:34:54.866	2025-10-28 09:36:45.345	\N	f	f	\N	91	3/8-вороток-Гобразный	ER-53825		Вороток 3/8" DR Г-образный 250мм на держателе ЭВРИКА	null	\N	\N	SPROUTED	\N	2025-10-28 09:36:13.552	\N	\N	1	0	\N	45	\N	MONOLITH	f	\N
195	ST5025-20251028-124048225-422533/child-3-1761644503740-wpfbrvqzp	40	\N	\N	2025-10-28 09:41:43.741	2025-11-02 10:23:02.056	\N	f	f	191	95	Щетки ручные	ST5025		Щетка латунированная STARTUL STANDART (ST5025) (проволочная, пластмассовая рукоятка)	null	2.64	\N	ARRIVED	IN_STORE	\N	2025-10-28 09:41:43.74	\N	0	0	\N	50	\N	MONOLITH	f	\N
196	ST5025-20251028-124048225-422533/child-4-1761644503743-g19vys43l	40	\N	\N	2025-10-28 09:41:43.744	2025-11-02 10:23:03.523	\N	f	f	191	95	Щетки ручные	ST5025		Щетка латунированная STARTUL STANDART (ST5025) (проволочная, пластмассовая рукоятка)	null	2.64	\N	ARRIVED	IN_STORE	\N	2025-10-28 09:41:43.744	\N	0	0	\N	50	\N	MONOLITH	f	\N
197	ST5025-20251028-124048225-422533/child-5-1761644503746-yvminrywq	40	\N	\N	2025-10-28 09:41:43.747	2025-11-02 10:23:05.362	\N	f	f	191	95	Щетки ручные	ST5025		Щетка латунированная STARTUL STANDART (ST5025) (проволочная, пластмассовая рукоятка)	null	2.64	\N	ARRIVED	IN_STORE	\N	2025-10-28 09:41:43.746	\N	0	0	\N	50	\N	MONOLITH	f	\N
198	ST5025-20251028-124048225-422533/child-6-1761644503749-2vbeqtl68	40	\N	\N	2025-10-28 09:41:43.75	2025-11-02 10:23:06.772	\N	f	f	191	95	Щетки ручные	ST5025		Щетка латунированная STARTUL STANDART (ST5025) (проволочная, пластмассовая рукоятка)	null	2.64	\N	ARRIVED	IN_STORE	\N	2025-10-28 09:41:43.749	\N	0	0	\N	50	\N	MONOLITH	f	\N
199	ST5025-20251028-124048225-422533/child-7-1761644503752-z6cmvmodj	40	\N	\N	2025-10-28 09:41:43.753	2025-11-02 10:23:08.497	\N	f	f	191	95	Щетки ручные	ST5025		Щетка латунированная STARTUL STANDART (ST5025) (проволочная, пластмассовая рукоятка)	null	2.64	\N	ARRIVED	IN_STORE	\N	2025-10-28 09:41:43.753	\N	0	0	\N	50	\N	MONOLITH	f	\N
200	ST5025-20251028-124048225-422533/child-8-1761644503755-q5k76ax1t	40	\N	\N	2025-10-28 09:41:43.756	2025-11-02 10:23:09.951	\N	f	f	191	95	Щетки ручные	ST5025		Щетка латунированная STARTUL STANDART (ST5025) (проволочная, пластмассовая рукоятка)	null	2.64	\N	ARRIVED	IN_STORE	\N	2025-10-28 09:41:43.755	\N	0	0	\N	50	\N	MONOLITH	f	\N
189	ER-53825-20251028-123454865-226300/child-1-1761644205348-lsb0bx2dm	39	\N	\N	2025-10-28 09:36:45.349	2025-11-03 08:20:48.964	\N	f	f	187	91	3/8-вороток-Гобразный	ER-53825		Вороток 3/8" DR Г-образный 250мм на держателе ЭВРИКА	null	7.74	\N	ARRIVED	IN_STORE	\N	2025-10-28 09:36:45.348	\N	0	0	\N	45	\N	MONOLITH	f	\N
190	ER-53825-20251028-123454865-226300/child-2-1761644205352-lgpt3ozlm	39	\N	\N	2025-10-28 09:36:45.353	2025-11-03 08:20:51.018	\N	f	f	187	91	3/8-вороток-Гобразный	ER-53825		Вороток 3/8" DR Г-образный 250мм на держателе ЭВРИКА	null	7.74	\N	ARRIVED	IN_STORE	\N	2025-10-28 09:36:45.352	\N	0	0	\N	45	\N	MONOLITH	f	\N
214	F-340122113-20251028-125655338-397612	43	\N	\N	2025-10-28 09:56:55.34	2025-10-28 09:56:55.34	\N	f	f	\N	95	Щетки ручные	F-340122113		Щетка по металлу ручная в пластиковом корпусе с прорезиненной рукояткой (металлический скребок-40мм, высокоуглеродистая сталь, 3x19рядов)	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	50	\N	MONOLITH	f	\N
205	RF-HB140-20251028-124715511-888059	42	\N	\N	2025-10-28 09:47:15.513	2025-10-28 09:47:15.513	\N	f	f	\N	95	Щетки ручные	RF-HB140		Щетка ручная по металлу с пластиковой ручкой(L общ-260мм, L раб.-140мм)	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	50	\N	MONOLITH	f	\N
217	FK-933T1-12P-20251028-125905275-099606	27	\N	\N	2025-10-28 09:59:05.277	2025-10-28 09:59:05.277	\N	f	f	\N	65	шпильки	FK-933T1-12P		Болт к набору для замены сайлентблоков М12	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	29	\N	MONOLITH	f	\N
206	F-HB140-20251028-124726989-968628	41	\N	\N	2025-10-28 09:47:26.99	2025-10-28 09:47:26.99	\N	f	f	\N	95	Щетки ручные	F-HB140		Щетка ручная по металлу с пластиковой ручкой(L общ-260мм, L раб.-140мм)	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	50	\N	MONOLITH	f	\N
204	F-HB140-20251028-124620508-896658	41	\N	\N	2025-10-28 09:46:20.509	2025-10-28 09:47:27.003	\N	f	f	\N	95	Щетки ручные	F-HB140		Щетка ручная по металлу с пластиковой ручкой(L общ-260мм, L раб.-140мм)	null	\N	\N	SPROUTED	\N	2025-10-28 09:46:42.001	\N	\N	1	0	\N	50	\N	MONOLITH	f	\N
211	44016-20251028-125609815-843164	44	\N	\N	2025-10-28 09:56:09.817	2025-10-28 09:56:09.817	\N	f	f	\N	95	Щетки ручные	44016		Щетка металлическая 6-рядная с пластиковой ручкой (АвтоDело) 44016	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	50	\N	MONOLITH	f	\N
210	44016-20251028-125449457-911154	44	\N	\N	2025-10-28 09:54:49.458	2025-10-28 09:56:09.823	\N	f	f	\N	95	Щетки ручные	44016		Щетка металлическая 6-рядная с пластиковой ручкой (АвтоDело) 44016	null	\N	\N	SPROUTED	\N	2025-10-28 09:55:28.931	\N	\N	1	0	\N	50	\N	MONOLITH	f	\N
207	F-HB140-20251028-124620508-896658/child-1-1761644847004-zovvxpgzb	41	\N	\N	2025-10-28 09:47:27.005	2025-10-28 09:47:40.785	\N	f	f	204	95	Щетки ручные	F-HB140		Щетка ручная по металлу с пластиковой ручкой(L общ-260мм, L раб.-140мм)	null	1.08	\N	ARRIVED	IN_STORE	\N	2025-10-28 09:47:27.004	\N	0	0	\N	50	\N	MONOLITH	f	\N
208	F-HB140-20251028-124620508-896658/child-2-1761644847008-s11133rv7	41	\N	\N	2025-10-28 09:47:27.009	2025-10-28 09:47:41.884	\N	f	f	204	95	Щетки ручные	F-HB140		Щетка ручная по металлу с пластиковой ручкой(L общ-260мм, L раб.-140мм)	null	1.08	\N	ARRIVED	IN_STORE	\N	2025-10-28 09:47:27.008	\N	0	0	\N	50	\N	MONOLITH	f	\N
209	F-340122113-20251028-125444646-691139	43	\N	\N	2025-10-28 09:54:44.648	2025-10-28 09:56:55.346	\N	f	f	\N	95	Щетки ручные	F-340122113		Щетка по металлу ручная в пластиковом корпусе с прорезиненной рукояткой (металлический скребок-40мм, высокоуглеродистая сталь, 3x19рядов)	null	\N	\N	SPROUTED	\N	2025-10-28 09:55:32.9	\N	\N	1	0	\N	50	\N	MONOLITH	f	\N
203	RF-HB140-20251028-124616533-791625	42	\N	\N	2025-10-28 09:46:16.534	2025-10-28 09:48:04.371	\N	f	f	\N	95	Щетки ручные	RF-HB140		Щетка ручная по металлу с пластиковой ручкой(L общ-260мм, L раб.-140мм)	null	1.41	\N	ARRIVED	IN_STORE	2025-10-28 09:46:41.115	2025-10-28 09:47:15.526	\N	1	0	\N	50	\N	MONOLITH	f	\N
213	44016-20251028-125449457-911154/child-2-1761645369829-4k0hvevjo	44	\N	\N	2025-10-28 09:56:09.83	2025-10-28 09:56:32.064	\N	f	f	210	95	Щетки ручные	44016		Щетка металлическая 6-рядная с пластиковой ручкой (АвтоDело) 44016	null	5.52	\N	ARRIVED	IN_STORE	\N	2025-10-28 09:56:09.829	\N	0	0	\N	50	\N	MONOLITH	f	\N
215	F-340122113-20251028-125444646-691139/child-1-1761645415347-df60vkkwy	43	\N	\N	2025-10-28 09:56:55.348	2025-10-28 09:57:05.757	\N	f	f	209	95	Щетки ручные	F-340122113		Щетка по металлу ручная в пластиковом корпусе с прорезиненной рукояткой (металлический скребок-40мм, высокоуглеродистая сталь, 3x19рядов)	null	6.93	\N	ARRIVED	IN_STORE	\N	2025-10-28 09:56:55.347	\N	0	0	\N	50	\N	MONOLITH	f	\N
212	44016-20251028-125449457-911154/child-1-1761645369825-bmhuro6ws	44	\N	\N	2025-10-28 09:56:09.826	2025-10-28 09:56:33.035	\N	f	f	210	95	Щетки ручные	44016		Щетка металлическая 6-рядная с пластиковой ручкой (АвтоDело) 44016	null	5.52	\N	ARRIVED	IN_STORE	\N	2025-10-28 09:56:09.825	\N	0	0	\N	50	\N	MONOLITH	f	\N
216	F-340122113-20251028-125444646-691139/child-2-1761645415350-sq4sexaq6	43	\N	\N	2025-10-28 09:56:55.351	2025-10-28 09:57:06.807	\N	f	f	209	95	Щетки ручные	F-340122113		Щетка по металлу ручная в пластиковом корпусе с прорезиненной рукояткой (металлический скребок-40мм, высокоуглеродистая сталь, 3x19рядов)	null	6.93	\N	ARRIVED	IN_STORE	\N	2025-10-28 09:56:55.35	\N	0	0	\N	50	\N	MONOLITH	f	\N
220	FK-933T1-12P-20251025-150749248-082852/child-3-1761645545299-6iixdd2d4	27	28	2025-10-28 10:01:16.022	2025-10-28 09:59:05.299	2025-10-28 10:01:16.023	\N	f	f	117	65	шпильки	FK-933T1-12P		Болт к набору для замены сайлентблоков М12	null	19.5	\N	ARRIVED	SOLD	\N	2025-10-28 09:59:05.299	\N	0	0	\N	29	\N	MONOLITH	f	\N
222	RF-807421-20251028-131936371-961930	45	\N	\N	2025-10-28 10:19:36.372	2025-10-28 10:19:36.372	\N	f	f	\N	88	свечные головки	RF-807421		Головка свечная 21мм 1/2''(6гр.)	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	51	\N	MONOLITH	f	\N
221	RF-807421-20251028-131446896-922954	45	\N	\N	2025-10-28 10:14:46.897	2025-10-28 10:19:36.379	\N	f	f	\N	88	свечные головки	RF-807421		Головка свечная 21мм 1/2''(6гр.)	null	\N	\N	SPROUTED	\N	2025-10-28 10:15:00.921	\N	\N	1	0	\N	51	\N	MONOLITH	f	\N
219	FK-933T1-12P-20251025-150749248-082852/child-2-1761645545296-qz6plx607	27	\N	\N	2025-10-28 09:59:05.296	2025-11-02 10:23:21.266	\N	f	f	117	65	шпильки	FK-933T1-12P		Болт к набору для замены сайлентблоков М12	null	19.5	\N	ARRIVED	IN_STORE	\N	2025-10-28 09:59:05.296	\N	0	0	\N	29	\N	MONOLITH	f	\N
218	FK-933T1-12P-20251025-150749248-082852/child-1-1761645545292-csuh8r0e2	27	\N	\N	2025-10-28 09:59:05.293	2025-11-02 10:23:19.458	\N	f	f	117	65	шпильки	FK-933T1-12P		Болт к набору для замены сайлентблоков М12	null	19.5	\N	ARRIVED	IN_STORE	\N	2025-10-28 09:59:05.292	\N	0	0	\N	29	\N	MONOLITH	f	\N
223	RF-807421-20251028-131446896-922954/child-1-1761646776381-z0h65s39n	45	\N	\N	2025-10-28 10:19:36.383	2025-10-28 10:19:52.456	\N	f	f	221	88	свечные головки	RF-807421		Головка свечная 21мм 1/2''(6гр.)	null	2.25	\N	ARRIVED	IN_STORE	\N	2025-10-28 10:19:36.381	\N	0	0	\N	51	\N	MONOLITH	f	\N
224	RF-807421-20251028-131446896-922954/child-2-1761646776386-tilnt58ev	45	\N	\N	2025-10-28 10:19:36.387	2025-10-28 10:19:53.155	\N	f	f	221	88	свечные головки	RF-807421		Головка свечная 21мм 1/2''(6гр.)	null	2.25	\N	ARRIVED	IN_STORE	\N	2025-10-28 10:19:36.386	\N	0	0	\N	51	\N	MONOLITH	f	\N
226	FSEB1250-20251028-132816653-519466	47	\N	\N	2025-10-28 10:28:16.655	2025-10-28 10:28:16.655	\N	f	f	\N	17	Torx_17675	FSEB1250		Насадка TORX T50 75мм LONG TOPTUL	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	52	\N	MONOLITH	f	\N
225	FSEB1250-20251028-132713091-288653	47	\N	\N	2025-10-28 10:27:13.092	2025-10-28 10:28:16.671	\N	f	f	\N	17	Torx_17675	FSEB1250		Насадка TORX T50 75мм LONG TOPTUL	null	\N	\N	SPROUTED	\N	2025-10-28 10:27:51.14	\N	\N	1	0	\N	52	\N	MONOLITH	f	\N
238	RF-1767545 Premium-20251028-133301360-090572/child-4-1761647671623-18c3yl5ro	48	\N	\N	2025-10-28 10:34:31.624	2025-10-28 10:35:06.157	\N	f	f	232	17	Torx_17675	RF-1767545 Premium		Бита TORX T45х75ммL,10мм	null	2	\N	ARRIVED	IN_STORE	\N	2025-10-28 10:34:31.623	\N	0	0	\N	53	\N	MONOLITH	f	\N
234	RF-1767545 Premium-20251028-133431591-282168	48	\N	\N	2025-10-28 10:34:31.593	2025-10-28 10:34:31.593	\N	f	f	\N	17	Torx_17675	RF-1767545 Premium		Бита TORX T45х75ммL,10мм	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	53	\N	MONOLITH	f	\N
232	RF-1767545 Premium-20251028-133301360-090572	48	\N	\N	2025-10-28 10:33:01.361	2025-10-28 10:34:31.608	\N	f	f	\N	17	Torx_17675	RF-1767545 Premium		Бита TORX T45х75ммL,10мм	null	\N	\N	SPROUTED	\N	2025-10-28 10:33:51.084	\N	\N	1	0	\N	53	\N	MONOLITH	f	\N
240	FSEB1245-20251028-133450988-385165	49	\N	\N	2025-10-28 10:34:50.99	2025-10-28 10:34:50.99	\N	f	f	\N	17	Torx_17675	FSEB1245		Насадка TORX T45 75мм LONG TOPTUL	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	53	\N	MONOLITH	f	\N
233	FSEB1245-20251028-133316939-655311	49	\N	\N	2025-10-28 10:33:16.941	2025-10-28 10:34:50.994	\N	f	f	\N	17	Torx_17675	FSEB1245		Насадка TORX T45 75мм LONG TOPTUL	null	\N	\N	SPROUTED	\N	2025-10-28 10:33:50.493	\N	\N	1	0	\N	53	\N	MONOLITH	f	\N
236	RF-1767545 Premium-20251028-133301360-090572/child-2-1761647671615-r4rhuvedy	48	\N	\N	2025-10-28 10:34:31.616	2025-10-28 10:35:07.42	\N	f	f	232	17	Torx_17675	RF-1767545 Premium		Бита TORX T45х75ммL,10мм	null	2	\N	ARRIVED	IN_STORE	\N	2025-10-28 10:34:31.615	\N	0	0	\N	53	\N	MONOLITH	f	\N
246	1767530-20251028-134559400-973173	50	\N	\N	2025-10-28 10:45:59.401	2025-10-28 10:47:29.933	\N	f	f	\N	17	Torx_17675	1767530		Насадка 10мм. L-75мм. TORX T30 FORCE 1767530	null	\N	\N	SPROUTED	\N	2025-10-28 10:47:01.374	\N	\N	1	0	\N	55	\N	MONOLITH	f	\N
239	RF-1767545 Premium-20251028-133301360-090572/child-5-1761647671627-qvzdvi4sl	48	\N	\N	2025-10-28 10:34:31.628	2025-10-28 10:35:05.574	\N	f	f	232	17	Torx_17675	RF-1767545 Premium		Бита TORX T45х75ммL,10мм	null	2	\N	ARRIVED	IN_STORE	\N	2025-10-28 10:34:31.627	\N	0	0	\N	53	\N	MONOLITH	f	\N
237	RF-1767545 Premium-20251028-133301360-090572/child-3-1761647671619-1obmmeb13	48	\N	\N	2025-10-28 10:34:31.62	2025-10-28 10:35:06.873	\N	f	f	232	17	Torx_17675	RF-1767545 Premium		Бита TORX T45х75ммL,10мм	null	2	\N	ARRIVED	IN_STORE	\N	2025-10-28 10:34:31.619	\N	0	0	\N	53	\N	MONOLITH	f	\N
235	RF-1767545 Premium-20251028-133301360-090572/child-1-1761647671610-xssdqe0et	48	\N	\N	2025-10-28 10:34:31.611	2025-10-28 10:35:09.251	\N	f	f	232	17	Torx_17675	RF-1767545 Premium		Бита TORX T45х75ммL,10мм	null	2	\N	ARRIVED	IN_STORE	\N	2025-10-28 10:34:31.61	\N	0	0	\N	53	\N	MONOLITH	f	\N
229	FSEB1250-20251028-132713091-288653/child-3-1761647296681-lww1tdc54	47	5	2025-10-28 10:56:45.053	2025-10-28 10:28:16.683	2025-10-28 10:56:45.054	\N	f	f	225	17	Torx_17675	FSEB1250		Насадка TORX T50 75мм LONG TOPTUL	null	3.37	\N	ARRIVED	SOLD	\N	2025-10-28 10:28:16.682	\N	0	0	\N	52	\N	MONOLITH	f	\N
247	1767530-20251028-134729918-712235	50	\N	\N	2025-10-28 10:47:29.919	2025-10-28 10:47:29.919	\N	f	f	\N	17	Torx_17675	1767530		Насадка 10мм. L-75мм. TORX T30 FORCE 1767530	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	55	\N	MONOLITH	f	\N
241	FSEB1245-20251028-133316939-655311/child-1-1761647690996-we63vbozh	49	6	2025-10-28 12:08:05.3	2025-10-28 10:34:50.997	2025-10-28 12:08:05.301	\N	f	f	233	17	Torx_17675	FSEB1245		Насадка TORX T45 75мм LONG TOPTUL	null	3.37	\N	ARRIVED	SOLD	\N	2025-10-28 10:34:50.996	\N	0	0	\N	53	\N	MONOLITH	f	\N
249	1767530-20251028-134559400-973173/child-2-1761648449939-95hutfyhh	50	\N	\N	2025-10-28 10:47:29.94	2025-10-28 10:47:54.135	\N	f	f	246	17	Torx_17675	1767530		Насадка 10мм. L-75мм. TORX T30 FORCE 1767530	null	3.12	\N	ARRIVED	IN_STORE	\N	2025-10-28 10:47:29.939	\N	0	0	\N	55	\N	MONOLITH	f	\N
252	1767530-20251028-134559400-973173/child-5-1761648449949-utnaexlef	50	5	2025-10-29 08:49:32.223	2025-10-28 10:47:29.949	2025-10-29 08:49:32.225	\N	f	f	246	17	Torx_17675	1767530		Насадка 10мм. L-75мм. TORX T30 FORCE 1767530	null	3.12	\N	ARRIVED	SOLD	\N	2025-10-28 10:47:29.949	\N	0	0	\N	55	\N	MONOLITH	f	\N
227	FSEB1250-20251028-132713091-288653/child-1-1761647296673-jxgdtyju8	47	\N	\N	2025-10-28 10:28:16.674	2025-11-02 10:23:23.957	\N	f	f	225	17	Torx_17675	FSEB1250		Насадка TORX T50 75мм LONG TOPTUL	null	3.37	\N	ARRIVED	IN_STORE	\N	2025-10-28 10:28:16.673	\N	0	0	\N	52	\N	MONOLITH	f	\N
228	FSEB1250-20251028-132713091-288653/child-2-1761647296677-ahulytwi7	47	\N	\N	2025-10-28 10:28:16.679	2025-11-02 10:23:25.642	\N	f	f	225	17	Torx_17675	FSEB1250		Насадка TORX T50 75мм LONG TOPTUL	null	3.37	\N	ARRIVED	IN_STORE	\N	2025-10-28 10:28:16.678	\N	0	0	\N	52	\N	MONOLITH	f	\N
230	FSEB1250-20251028-132713091-288653/child-4-1761647296686-kx91i40ch	47	\N	\N	2025-10-28 10:28:16.687	2025-11-02 10:23:27.217	\N	f	f	225	17	Torx_17675	FSEB1250		Насадка TORX T50 75мм LONG TOPTUL	null	3.37	\N	ARRIVED	IN_STORE	\N	2025-10-28 10:28:16.686	\N	0	0	\N	52	\N	MONOLITH	f	\N
231	FSEB1250-20251028-132713091-288653/child-5-1761647296690-te3dmao89	47	\N	\N	2025-10-28 10:28:16.691	2025-11-02 10:23:28.962	\N	f	f	225	17	Torx_17675	FSEB1250		Насадка TORX T50 75мм LONG TOPTUL	null	3.37	\N	ARRIVED	IN_STORE	\N	2025-10-28 10:28:16.69	\N	0	0	\N	52	\N	MONOLITH	f	\N
242	FSEB1245-20251028-133316939-655311/child-2-1761647690999-o5okh5akz	49	\N	\N	2025-10-28 10:34:51	2025-11-02 10:23:30.836	\N	f	f	233	17	Torx_17675	FSEB1245		Насадка TORX T45 75мм LONG TOPTUL	null	3.37	\N	ARRIVED	IN_STORE	\N	2025-10-28 10:34:50.999	\N	0	0	\N	53	\N	MONOLITH	f	\N
243	FSEB1245-20251028-133316939-655311/child-3-1761647691002-unx3qyq4r	49	\N	\N	2025-10-28 10:34:51.002	2025-11-02 10:23:32.428	\N	f	f	233	17	Torx_17675	FSEB1245		Насадка TORX T45 75мм LONG TOPTUL	null	3.37	\N	ARRIVED	IN_STORE	\N	2025-10-28 10:34:51.002	\N	0	0	\N	53	\N	MONOLITH	f	\N
244	FSEB1245-20251028-133316939-655311/child-4-1761647691004-c4oqcjv85	49	\N	\N	2025-10-28 10:34:51.005	2025-11-02 10:23:33.951	\N	f	f	233	17	Torx_17675	FSEB1245		Насадка TORX T45 75мм LONG TOPTUL	null	3.37	\N	ARRIVED	IN_STORE	\N	2025-10-28 10:34:51.005	\N	0	0	\N	53	\N	MONOLITH	f	\N
245	FSEB1245-20251028-133316939-655311/child-5-1761647691007-v5oe92nd2	49	\N	\N	2025-10-28 10:34:51.008	2025-11-02 10:23:35.576	\N	f	f	233	17	Torx_17675	FSEB1245		Насадка TORX T45 75мм LONG TOPTUL	null	3.37	\N	ARRIVED	IN_STORE	\N	2025-10-28 10:34:51.008	\N	0	0	\N	53	\N	MONOLITH	f	\N
248	1767530-20251028-134559400-973173/child-1-1761648449935-40h0xwfa5	50	\N	\N	2025-10-28 10:47:29.936	2025-10-28 10:47:51.471	\N	f	f	246	17	Torx_17675	1767530		Насадка 10мм. L-75мм. TORX T30 FORCE 1767530	null	3.12	\N	ARRIVED	IN_STORE	\N	2025-10-28 10:47:29.935	\N	0	0	\N	55	\N	MONOLITH	f	\N
250	1767530-20251028-134559400-973173/child-3-1761648449942-d2msxtf9r	50	\N	\N	2025-10-28 10:47:29.943	2025-10-28 10:47:52.012	\N	f	f	246	17	Torx_17675	1767530		Насадка 10мм. L-75мм. TORX T30 FORCE 1767530	null	3.12	\N	ARRIVED	IN_STORE	\N	2025-10-28 10:47:29.942	\N	0	0	\N	55	\N	MONOLITH	f	\N
253	GAAV0703-20251028-135121093-964179	51	\N	\N	2025-10-28 10:51:21.094	2025-10-28 10:57:55.633	\N	f	f	\N	96	наборы бит 1/4-1/4	GAAV0703		Набор бит TORX с отверст. Т10-Т40 7шт. TOPTUL	null	6.45	\N	ARRIVED	IN_STORE	2025-10-28 10:57:30.965	2025-10-28 10:57:49.561	\N	1	0	\N	58	\N	MONOLITH	f	\N
259	FSEA1245-20251028-150355910-108974/child-1-1761653193978-uyqzjsvdr	52	\N	\N	2025-10-28 12:06:33.979	2025-10-28 12:06:47.959	\N	f	f	257	20	torx-17630	FSEA1245		Насадка TORX T45 30мм TOPTUL (Присоединительный размер 10мм)	null	1.6	\N	ARRIVED	IN_STORE	\N	2025-10-28 12:06:33.978	\N	0	0	\N	59	\N	MONOLITH	f	\N
255	GAAV0703-20251028-135809161-432563	51	\N	\N	2025-10-28 10:58:09.162	2025-10-28 10:58:09.162	\N	f	f	\N	96	наборы бит 1/4-1/4	GAAV0703		Набор бит TORX с отверст. Т10-Т40 7шт. TOPTUL	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	58	\N	MONOLITH	f	\N
261	FSEA1245-20251028-150355910-108974/child-3-1761653193985-cgmc3c5us	52	\N	\N	2025-10-28 12:06:33.986	2025-10-28 12:06:51.632	\N	f	f	257	20	torx-17630	FSEA1245		Насадка TORX T45 30мм TOPTUL (Присоединительный размер 10мм)	null	1.6	\N	ARRIVED	IN_STORE	\N	2025-10-28 12:06:33.985	\N	0	0	\N	59	\N	MONOLITH	f	\N
260	FSEA1245-20251028-150355910-108974/child-2-1761653193982-6b9ca0rwp	52	\N	\N	2025-10-28 12:06:33.983	2025-10-28 12:06:44.74	\N	f	f	257	20	torx-17630	FSEA1245		Насадка TORX T45 30мм TOPTUL (Присоединительный размер 10мм)	null	1.6	\N	ARRIVED	IN_STORE	\N	2025-10-28 12:06:33.982	\N	0	0	\N	59	\N	MONOLITH	f	\N
265	FSEA1245-20251028-150355910-108974/child-7-1761653193997-w4jjq4ysc	52	4	2025-10-28 12:07:14.543	2025-10-28 12:06:33.998	2025-10-28 12:07:14.544	\N	f	f	257	20	torx-17630	FSEA1245		Насадка TORX T45 30мм TOPTUL (Присоединительный размер 10мм)	null	1.6	\N	ARRIVED	SOLD	\N	2025-10-28 12:06:33.997	\N	0	0	\N	59	\N	MONOLITH	f	\N
264	FSEA1245-20251028-150355910-108974/child-6-1761653193994-9tz2wm7v9	52	\N	\N	2025-10-28 12:06:33.995	2025-10-28 12:06:49.563	\N	f	f	257	20	torx-17630	FSEA1245		Насадка TORX T45 30мм TOPTUL (Присоединительный размер 10мм)	null	1.6	\N	ARRIVED	IN_STORE	\N	2025-10-28 12:06:33.994	\N	0	0	\N	59	\N	MONOLITH	f	\N
254	GAAV0703-20251028-135749546-285789	51	10	2025-10-28 10:58:26.454	2025-10-28 10:57:49.548	2025-10-28 10:58:26.456	\N	f	f	\N	96	наборы бит 1/4-1/4	GAAV0703		Набор бит TORX с отверст. Т10-Т40 7шт. TOPTUL	null	6.45	\N	ARRIVED	SOLD	2025-10-28 10:57:58.571	2025-10-28 10:58:09.174	\N	1	0	\N	58	\N	MONOLITH	f	\N
258	FSEA1245-20251028-150633968-624458	52	\N	\N	2025-10-28 12:06:33.969	2025-10-28 12:06:33.969	\N	f	f	\N	20	torx-17630	FSEA1245		Насадка TORX T45 30мм TOPTUL (Присоединительный размер 10мм)	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	59	\N	MONOLITH	f	\N
257	FSEA1245-20251028-150355910-108974	52	\N	\N	2025-10-28 12:03:55.912	2025-10-28 12:06:33.976	\N	f	f	\N	20	torx-17630	FSEA1245		Насадка TORX T45 30мм TOPTUL (Присоединительный размер 10мм)	null	\N	\N	SPROUTED	\N	2025-10-28 12:04:12.246	\N	\N	1	0	\N	59	\N	MONOLITH	f	\N
251	1767530-20251028-134559400-973173/child-4-1761648449945-j50xaa3qi	50	5	2025-10-29 08:51:41.396	2025-10-28 10:47:29.946	2025-10-29 08:51:41.397	\N	f	f	246	17	Torx_17675	1767530		Насадка 10мм. L-75мм. TORX T30 FORCE 1767530	null	3.12	\N	ARRIVED	SOLD	\N	2025-10-28 10:47:29.945	\N	0	0	\N	55	\N	MONOLITH	f	\N
262	FSEA1245-20251028-150355910-108974/child-4-1761653193988-b0f0p6vxh	52	\N	\N	2025-10-28 12:06:33.989	2025-10-28 12:06:50.944	\N	f	f	257	20	torx-17630	FSEA1245		Насадка TORX T45 30мм TOPTUL (Присоединительный размер 10мм)	null	1.6	\N	ARRIVED	IN_STORE	\N	2025-10-28 12:06:33.988	\N	0	0	\N	59	\N	MONOLITH	f	\N
266	F-75532-20251028-151035700-078738	53	19	2025-10-28 12:29:20.841	2025-10-28 12:10:35.701	2025-10-28 12:29:20.843	\N	f	f	\N	97	комбинир. поштучно	F-75532		Ключ комбинированный 32мм	null	14.97	\N	ARRIVED	SOLD	2025-10-28 12:10:51.464	2025-10-28 12:17:58.37	\N	1	0	\N	62	\N	MONOLITH	f	\N
263	FSEA1245-20251028-150355910-108974/child-5-1761653193991-hsjcz211g	52	\N	\N	2025-10-28 12:06:33.992	2025-10-28 12:06:50.153	\N	f	f	257	20	torx-17630	FSEA1245		Насадка TORX T45 30мм TOPTUL (Присоединительный размер 10мм)	null	1.6	\N	ARRIVED	IN_STORE	\N	2025-10-28 12:06:33.991	\N	0	0	\N	59	\N	MONOLITH	f	\N
267	F-75532-20251028-151758364-216245	53	\N	\N	2025-10-28 12:17:58.366	2025-10-28 12:17:58.366	\N	f	f	\N	97	комбинир. поштучно	F-75532		Ключ комбинированный 32мм	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	62	\N	MONOLITH	f	\N
269	539 230-20251028-153414829-965456	54	\N	\N	2025-10-28 12:34:14.83	2025-10-28 12:36:39.837	\N	f	f	\N	99	монтировки с рукояткой	539 230		Монтировка с рукояткой 20×450мм	null	\N	\N	SPROUTED	\N	2025-10-28 12:34:55.432	\N	\N	1	0	\N	63	\N	MONOLITH	f	\N
271	539 210-20251028-153535999-750214	55	\N	\N	2025-10-28 12:35:36.001	2025-10-28 12:35:36.001	\N	f	f	\N	99	монтировки с рукояткой	539 210		Монтировка с рукояткой 11×220мм	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	63	\N	MONOLITH	f	\N
256	R7401001-20251028-141611211-637590	7	\N	\N	2025-10-28 11:16:11.213	2025-10-29 10:39:37.531	\N	f	f	\N	29	ТАЗИКИ	R7401001		ARNEZI R7401001 Поддон для слива масла 8 л.	null	\N	\N	CANDIDATE	\N	\N	\N	\N	0	0	\N	6	\N	MONOLITH	f	\N
272	539 240-20251028-153556754-766600	56	\N	\N	2025-10-28 12:35:56.756	2025-10-28 12:35:56.756	\N	f	f	\N	99	монтировки с рукояткой	539 240		Монтировка с рукояткой 20×590мм	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	63	\N	MONOLITH	f	\N
273	539 230-20251028-153639830-142277	54	\N	\N	2025-10-28 12:36:39.831	2025-10-28 12:36:39.831	\N	f	f	\N	99	монтировки с рукояткой	539 230		Монтировка с рукояткой 20×450мм	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	63	\N	MONOLITH	f	\N
275	539 230-20251028-153414829-965456/child-2-1761654999845-uol56w1dm	54	\N	\N	2025-10-28 12:36:39.846	2025-10-28 12:36:52.338	\N	f	f	269	99	монтировки с рукояткой	539 230		Монтировка с рукояткой 20×450мм	null	12.12	\N	ARRIVED	IN_STORE	\N	2025-10-28 12:36:39.845	\N	0	0	\N	63	\N	MONOLITH	f	\N
274	539 230-20251028-153414829-965456/child-1-1761654999841-2k3p7vcf2	54	\N	\N	2025-10-28 12:36:39.842	2025-10-28 12:36:53.626	\N	f	f	269	99	монтировки с рукояткой	539 230		Монтировка с рукояткой 20×450мм	null	12.12	\N	ARRIVED	IN_STORE	\N	2025-10-28 12:36:39.841	\N	0	0	\N	63	\N	MONOLITH	f	\N
268	539 210-20251028-153405751-181240	55	\N	\N	2025-10-28 12:34:05.752	2025-10-28 12:36:54.245	\N	f	f	\N	99	монтировки с рукояткой	539 210		Монтировка с рукояткой 11×220мм	null	5.94	\N	ARRIVED	IN_STORE	2025-10-28 12:34:55.011	2025-10-28 12:35:36.012	\N	1	0	\N	63	\N	MONOLITH	f	\N
282	560 008-20251028-154525280-908559/child-2-1761655645091-7gb41wh2m	57	\N	\N	2025-10-28 12:47:25.092	2025-10-28 12:47:36.185	\N	f	f	278	101	КЛЮЧ (кочерга)	560 008		Ключ четырехгранный 8мм	null	2.7	\N	ARRIVED	IN_STORE	\N	2025-10-28 12:47:25.091	\N	0	0	\N	65	\N	MONOLITH	f	\N
270	539 240-20251028-153417879-426210	56	\N	\N	2025-10-28 12:34:17.88	2025-10-28 12:36:50.969	\N	f	f	\N	99	монтировки с рукояткой	539 240		Монтировка с рукояткой 20×590мм	null	14.58	\N	ARRIVED	IN_STORE	2025-10-28 12:34:56.092	2025-10-28 12:35:56.759	\N	1	0	\N	63	\N	MONOLITH	f	\N
276	539 230-20251028-153414829-965456/child-3-1761654999848-a8otf9z4r	54	20	2025-10-28 12:37:37.146	2025-10-28 12:36:39.849	2025-10-28 12:37:37.147	\N	f	f	269	99	монтировки с рукояткой	539 230		Монтировка с рукояткой 20×450мм	null	12.12	\N	ARRIVED	SOLD	\N	2025-10-28 12:36:39.848	\N	0	0	\N	63	\N	MONOLITH	f	\N
286	560 008-20251028-154525280-908559/child-6-1761655645103-0c3hxu386	57	\N	\N	2025-10-28 12:47:25.104	2025-10-28 12:47:38.662	\N	f	f	278	101	КЛЮЧ (кочерга)	560 008		Ключ четырехгранный 8мм	null	2.7	\N	ARRIVED	IN_STORE	\N	2025-10-28 12:47:25.103	\N	0	0	\N	65	\N	MONOLITH	f	\N
279	560 010-20251028-154709306-958475	58	\N	\N	2025-10-28 12:47:09.307	2025-10-28 12:47:09.307	\N	f	f	\N	101	КЛЮЧ (кочерга)	560 010		Ключ четырехгранный 10мм	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	66	\N	MONOLITH	f	\N
283	560 008-20251028-154525280-908559/child-3-1761655645094-wmtd5tsdd	57	\N	\N	2025-10-28 12:47:25.095	2025-10-28 12:47:37.164	\N	f	f	278	101	КЛЮЧ (кочерга)	560 008		Ключ четырехгранный 8мм	null	2.7	\N	ARRIVED	IN_STORE	\N	2025-10-28 12:47:25.095	\N	0	0	\N	65	\N	MONOLITH	f	\N
280	560 008-20251028-154725079-135575	57	\N	\N	2025-10-28 12:47:25.081	2025-10-28 12:47:25.081	\N	f	f	\N	101	КЛЮЧ (кочерга)	560 008		Ключ четырехгранный 8мм	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	65	\N	MONOLITH	f	\N
278	560 008-20251028-154525280-908559	57	\N	\N	2025-10-28 12:45:25.281	2025-10-28 12:47:25.087	\N	f	f	\N	101	КЛЮЧ (кочерга)	560 008		Ключ четырехгранный 8мм	null	\N	\N	SPROUTED	\N	2025-10-28 12:45:48.3	\N	\N	1	0	\N	65	\N	MONOLITH	f	\N
298	R7300121-20251029-103632161-544896	61	\N	\N	2025-10-29 07:36:32.172	2025-10-29 07:36:32.172	\N	f	f	\N	104	ДИНАМОМЕТРИЧЕСКИЕ КЛЮЧИ	R7300121		Ключ динамометрический 1/2 20-210 Нм, 72 зуба, в кейсе L=490мм ARNEZI R7300121	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	72	\N	MONOLITH	f	\N
277	560 010-20251028-154521638-709603	58	\N	\N	2025-10-28 12:45:21.642	2025-10-28 12:47:34.351	\N	f	f	\N	101	КЛЮЧ (кочерга)	560 010		Ключ четырехгранный 10мм	null	4.5	\N	ARRIVED	IN_STORE	2025-10-28 12:45:47.736	2025-10-28 12:47:09.319	\N	1	0	\N	66	\N	MONOLITH	f	\N
284	560 008-20251028-154525280-908559/child-4-1761655645097-f02i6e2aj	57	\N	\N	2025-10-28 12:47:25.098	2025-10-28 12:47:37.641	\N	f	f	278	101	КЛЮЧ (кочерга)	560 008		Ключ четырехгранный 8мм	null	2.7	\N	ARRIVED	IN_STORE	\N	2025-10-28 12:47:25.097	\N	0	0	\N	65	\N	MONOLITH	f	\N
287	560 008-20251028-154525280-908559/child-7-1761655645106-75n70pcmc	57	\N	\N	2025-10-28 12:47:25.107	2025-10-28 12:47:39.508	\N	f	f	278	101	КЛЮЧ (кочерга)	560 008		Ключ четырехгранный 8мм	null	2.7	\N	ARRIVED	IN_STORE	\N	2025-10-28 12:47:25.106	\N	0	0	\N	65	\N	MONOLITH	f	\N
281	560 008-20251028-154525280-908559/child-1-1761655645088-d0l8v3sck	57	\N	\N	2025-10-28 12:47:25.089	2025-10-28 12:47:35.639	\N	f	f	278	101	КЛЮЧ (кочерга)	560 008		Ключ четырехгранный 8мм	null	2.7	\N	ARRIVED	IN_STORE	\N	2025-10-28 12:47:25.088	\N	0	0	\N	65	\N	MONOLITH	f	\N
293	R7300141-20251029-102930291-188059/child-1-1761723008909-blz6x5dv0	60	80	2025-10-29 07:30:33.635	2025-10-29 07:30:08.91	2025-10-29 07:30:33.636	\N	f	f	291	104	ДИНАМОМЕТРИЧЕСКИЕ КЛЮЧИ	R7300141		Ключ динамометрический 1/4' 5-25 Нм, 72 зуба, в кейсе L=245мм ARNEZI R7300141	null	58.44	\N	ARRIVED	SOLD	\N	2025-10-29 07:30:08.909	\N	0	0	\N	70	\N	MONOLITH	f	\N
289	1783007-20251029-091811360-916175	59	4	2025-10-29 06:19:11.283	2025-10-29 06:18:11.361	2025-10-29 06:19:11.284	\N	f	f	\N	25	spine-17830	1783007		ита- сплайн М7 30мм Force 1783007	null	2	\N	ARRIVED	SOLD	2025-10-29 06:18:24.409	2025-10-29 06:18:38.5	\N	1	0	\N	69	\N	MONOLITH	f	\N
285	560 008-20251028-154525280-908559/child-5-1761655645100-4reovo766	57	\N	\N	2025-10-28 12:47:25.101	2025-10-28 12:47:38.16	\N	f	f	278	101	КЛЮЧ (кочерга)	560 008		Ключ четырехгранный 8мм	null	2.7	\N	ARRIVED	IN_STORE	\N	2025-10-28 12:47:25.1	\N	0	0	\N	65	\N	MONOLITH	f	\N
292	R7300141-20251029-103008891-792238	60	\N	\N	2025-10-29 07:30:08.892	2025-10-29 07:35:10.908	\N	f	f	\N	104	ДИНАМОМЕТРИЧЕСКИЕ КЛЮЧИ	R7300141		Ключ динамометрический 1/4' 5-25 Нм, 72 зуба, в кейсе L=245мм ARNEZI R7300141	null	\N	\N	CANDIDATE	\N	2025-10-29 07:35:10.907	\N	\N	1	0	\N	70	\N	MONOLITH	f	\N
288	560 008-20251028-154525280-908559/child-8-1761655645109-nxy31wq5b	57	8	2025-10-28 12:48:02.348	2025-10-28 12:47:25.11	2025-10-28 12:48:02.349	\N	f	f	278	101	КЛЮЧ (кочерга)	560 008		Ключ четырехгранный 8мм	null	2.7	\N	ARRIVED	SOLD	\N	2025-10-28 12:47:25.109	\N	0	0	\N	65	\N	MONOLITH	f	\N
290	1783007-20251029-091838495-653617	59	\N	\N	2025-10-29 06:18:38.496	2025-10-29 06:18:38.496	\N	f	f	\N	25	spine-17830	1783007		ита- сплайн М7 30мм Force 1783007	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	69	\N	MONOLITH	f	\N
291	R7300141-20251029-102930291-188059	60	\N	\N	2025-10-29 07:29:30.292	2025-10-29 07:30:08.907	\N	f	f	\N	104	ДИНАМОМЕТРИЧЕСКИЕ КЛЮЧИ	R7300141		Ключ динамометрический 1/4' 5-25 Нм, 72 зуба, в кейсе L=245мм ARNEZI R7300141	null	\N	\N	SPROUTED	\N	2025-10-29 07:29:48.399	\N	\N	1	0	\N	70	\N	MONOLITH	f	\N
297	R7300382-20251029-103602065-105143	62	\N	\N	2025-10-29 07:36:02.069	2025-10-29 07:36:02.069	\N	f	f	\N	104	ДИНАМОМЕТРИЧЕСКИЕ КЛЮЧИ	R7300382		Ключ динамометрический 3/8 10-110 Нм, 72 зуба, в кейсе L=470мм ARNEZI R7300382	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	71	\N	MONOLITH	f	\N
300	HZ 27.1.047W-20251029-104603110-611029	63	\N	\N	2025-10-29 07:46:03.111	2025-10-29 07:46:03.111	\N	f	f	\N	104	ДИНАМОМЕТРИЧЕСКИЕ КЛЮЧИ	HZ 27.1.047W		Вороток моментный с трещоточным механизмом 5-25 Hм 1/4" Хорекс Авто HZ 27.1.047W	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	70	\N	MONOLITH	f	\N
295	R7300382-20251029-103449975-011329	62	\N	\N	2025-10-29 07:34:49.976	2025-10-29 07:36:21.018	\N	f	f	\N	104	ДИНАМОМЕТРИЧЕСКИЕ КЛЮЧИ	R7300382		Ключ динамометрический 3/8 10-110 Нм, 72 зуба, в кейсе L=470мм ARNEZI R7300382	null	84.54	\N	ARRIVED	IN_STORE	2025-10-29 07:35:29.271	2025-10-29 07:36:02.079	\N	1	0	\N	71	\N	MONOLITH	f	\N
296	R7300121-20251029-103455686-358346	61	\N	\N	2025-10-29 07:34:55.688	2025-10-29 07:36:49.077	\N	f	f	\N	104	ДИНАМОМЕТРИЧЕСКИЕ КЛЮЧИ	R7300121		Ключ динамометрический 1/2 20-210 Нм, 72 зуба, в кейсе L=490мм ARNEZI R7300121	null	98.82	\N	ARRIVED	IN_STORE	2025-10-29 07:35:33.704	2025-10-29 07:36:32.165	\N	1	0	\N	72	\N	MONOLITH	f	\N
305	rf802222-20251025-155052831-391411/child-2-1761726017857-0vov4580i	31	\N	\N	2025-10-29 08:20:17.858	2025-10-29 08:20:37.765	\N	f	f	136	71	1/4" Трещотки	rf802222		Трещотка реверсивная усиленная изогнутая с резиновой ручкой 1/4''(72зуб.)	null	12	\N	ARRIVED	IN_STORE	\N	2025-10-29 08:20:17.857	\N	0	0	\N	37	\N	MONOLITH	f	\N
299	HZ 27.1.047W-20251029-104520595-671494	63	\N	\N	2025-10-29 07:45:20.596	2025-10-29 07:46:06.086	\N	f	f	\N	104	ДИНАМОМЕТРИЧЕСКИЕ КЛЮЧИ	HZ 27.1.047W		Вороток моментный с трещоточным механизмом 5-25 Hм 1/4" Хорекс Авто HZ 27.1.047W	null	66.75	\N	ARRIVED	IN_STORE	2025-10-29 07:45:42.228	2025-10-29 07:46:03.137	\N	1	0	\N	70	\N	MONOLITH	f	\N
306	rf802222-20251025-155052831-391411/child-3-1761726017860-sy7c31dzn	31	\N	\N	2025-10-29 08:20:17.861	2025-10-29 08:20:38.594	\N	f	f	136	71	1/4" Трещотки	rf802222		Трещотка реверсивная усиленная изогнутая с резиновой ручкой 1/4''(72зуб.)	null	12	\N	ARRIVED	IN_STORE	\N	2025-10-29 08:20:17.86	\N	0	0	\N	37	\N	MONOLITH	f	\N
308	rf802222-20251025-155052831-391411/child-5-1761726017866-jueuj4g41	31	12	2025-10-31 07:13:09.967	2025-10-29 08:20:17.867	2025-10-31 07:13:09.972	\N	f	f	136	71	1/4" Трещотки	rf802222		Трещотка реверсивная усиленная изогнутая с резиновой ручкой 1/4''(72зуб.)	null	12	\N	ARRIVED	SOLD	\N	2025-10-29 08:20:17.866	\N	0	0	\N	37	\N	MONOLITH	f	\N
301	CHAG0813-20251029-111614081-211901	64	\N	\N	2025-10-29 08:16:14.082	2025-10-29 08:18:01.161	\N	f	f	\N	108	трещотки ручные 1/4	CHAG0813		Трещотка 1/4" 36зуб. 131мм TOPTUL	null	27.73	\N	ARRIVED	IN_STORE	2025-10-29 08:16:46.75	2025-10-29 08:17:58.125	\N	1	0	\N	73	\N	MONOLITH	f	\N
303	rf802222-20251029-112017837-420073	31	\N	\N	2025-10-29 08:20:17.839	2025-10-29 08:20:17.839	\N	f	f	\N	71	1/4" Трещотки	rf802222		Трещотка реверсивная усиленная изогнутая с резиновой ручкой 1/4''(72зуб.)	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	37	\N	MONOLITH	f	\N
307	rf802222-20251025-155052831-391411/child-4-1761726017863-0ssyv5xqr	31	\N	\N	2025-10-29 08:20:17.864	2025-10-29 08:20:39.122	\N	f	f	136	71	1/4" Трещотки	rf802222		Трещотка реверсивная усиленная изогнутая с резиновой ручкой 1/4''(72зуб.)	null	12	\N	ARRIVED	IN_STORE	\N	2025-10-29 08:20:17.863	\N	0	0	\N	37	\N	MONOLITH	f	\N
312	BM-802222-20251029-112451751-048018	65	\N	\N	2025-10-29 08:24:51.753	2025-10-29 08:24:51.753	\N	f	f	\N	71	1/4" Трещотки	BM-802222		Ключ трещоточный 1/4''(72зуб)	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	37	\N	MONOLITH	f	\N
304	rf802222-20251025-155052831-391411/child-1-1761726017854-lfuwzlzhj	31	\N	\N	2025-10-29 08:20:17.855	2025-10-29 08:20:36.793	\N	f	f	136	71	1/4" Трещотки	rf802222		Трещотка реверсивная усиленная изогнутая с резиновой ручкой 1/4''(72зуб.)	null	12	\N	ARRIVED	IN_STORE	\N	2025-10-29 08:20:17.854	\N	0	0	\N	37	\N	MONOLITH	f	\N
311	BM-802222-20251029-112409012-143967	65	\N	\N	2025-10-29 08:24:09.013	2025-10-29 08:24:51.768	\N	f	f	\N	71	1/4" Трещотки	BM-802222		Ключ трещоточный 1/4''(72зуб)	null	\N	\N	SPROUTED	\N	2025-10-29 08:24:26.832	\N	\N	1	0	\N	37	\N	MONOLITH	f	\N
310	CHAG0813-20251029-112147457-624343	64	\N	\N	2025-10-29 08:21:47.459	2025-10-29 08:21:47.459	\N	f	f	\N	108	трещотки ручные 1/4	CHAG0813		Трещотка 1/4" 36зуб. 131мм TOPTUL	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	73	\N	MONOLITH	f	\N
316	CJBG0815-20251029-112735666-673924	66	\N	\N	2025-10-29 08:27:35.667	2025-10-29 08:27:35.667	\N	f	f	\N	108	трещотки ручные 1/4	CJBG0815		Трещотка 1/4" 36зуб. 150мм TOPTUL	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	74	\N	MONOLITH	f	\N
317	80222-20251029-112955677-610382	67	\N	\N	2025-10-29 08:29:55.678	2025-10-29 08:30:23.465	\N	f	f	\N	108	трещотки ручные 1/4	80222		Трещотка 1/4'' 24 зуб. 155 мм Force 80222	null	43	\N	ARRIVED	IN_STORE	2025-10-29 08:30:08.637	2025-10-29 08:30:21.861	\N	1	0	\N	74	\N	MONOLITH	f	\N
302	CHAG0813-20251029-111758120-696347	64	40	2025-10-29 08:22:13.242	2025-10-29 08:17:58.122	2025-10-29 08:22:13.243	\N	f	f	\N	108	трещотки ручные 1/4	CHAG0813		Трещотка 1/4" 36зуб. 131мм TOPTUL	null	27.73	\N	ARRIVED	SOLD	2025-10-29 08:21:23.315	2025-10-29 08:21:47.47	\N	1	0	\N	73	\N	MONOLITH	f	\N
313	BM-802222-20251029-112409012-143967/child-1-1761726291769-5u6xzuqkd	65	\N	\N	2025-10-29 08:24:51.771	2025-10-29 08:25:02.997	\N	f	f	311	71	1/4" Трещотки	BM-802222		Ключ трещоточный 1/4''(72зуб)	null	13.8	\N	ARRIVED	IN_STORE	\N	2025-10-29 08:24:51.77	\N	0	0	\N	37	\N	MONOLITH	f	\N
315	CJBG0815-20251029-112701430-916472	66	\N	\N	2025-10-29 08:27:01.431	2025-10-29 08:27:37.788	\N	f	f	\N	108	трещотки ручные 1/4	CJBG0815		Трещотка 1/4" 36зуб. 150мм TOPTUL	null	30.44	\N	ARRIVED	IN_STORE	2025-10-29 08:27:12.843	2025-10-29 08:27:35.67	\N	1	0	\N	74	\N	MONOLITH	f	\N
314	BM-802222-20251029-112409012-143967/child-2-1761726291773-yfd46dxmc	65	\N	\N	2025-10-29 08:24:51.774	2025-10-29 08:25:03.887	\N	f	f	311	71	1/4" Трещотки	BM-802222		Ключ трещоточный 1/4''(72зуб)	null	13.8	\N	ARRIVED	IN_STORE	\N	2025-10-29 08:24:51.773	\N	0	0	\N	37	\N	MONOLITH	f	\N
322	ER13130-20251029-114024302-068070	69	\N	\N	2025-10-29 08:40:24.304	2025-10-29 08:40:24.304	\N	f	f	\N	117	КЛЕЩИ ПЕРЕСТАВНЫЕ	ER13130		Клещи переставные ER-13130 универсальные, покрытие черное порошковое 300мм ЭВРИКА 1/36	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	76	\N	MONOLITH	f	\N
318	80222-20251029-113021849-447518	67	\N	\N	2025-10-29 08:30:21.85	2025-10-29 08:30:21.85	\N	f	f	\N	108	трещотки ручные 1/4	80222		Трещотка 1/4'' 24 зуб. 155 мм Force 80222	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	74	\N	MONOLITH	f	\N
321	ER13130-20251029-113941923-969559	69	\N	\N	2025-10-29 08:39:41.925	2025-10-29 08:40:24.317	\N	f	f	\N	117	КЛЕЩИ ПЕРЕСТАВНЫЕ	ER13130		Клещи переставные ER-13130 универсальные, покрытие черное порошковое 300мм ЭВРИКА 1/36	null	\N	\N	SPROUTED	\N	2025-10-29 08:39:54.769	\N	\N	1	0	\N	76	\N	MONOLITH	f	\N
320	Sch-TAP14x1.5-20251029-113529691-841549	68	\N	\N	2025-10-29 08:35:29.692	2025-10-29 08:35:29.692	\N	f	f	\N	113	Метчики поштучно	Sch-TAP14x1.5		Метчик M14x1,5 (3шт)	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	75	\N	MONOLITH	f	\N
319	Sch-TAP14x1.5-20251029-113501606-937177	68	15	2025-10-29 08:35:51.3	2025-10-29 08:35:01.608	2025-10-29 08:35:51.301	\N	f	f	\N	113	Метчики поштучно	Sch-TAP14x1.5		Метчик M14x1,5 (3шт)	null	9.99	\N	ARRIVED	SOLD	2025-10-29 08:35:12.106	2025-10-29 08:35:29.704	\N	1	0	\N	75	\N	MONOLITH	f	\N
309	rf802222-20251025-155052831-391411/child-6-1761726017869-bqxq6uava	31	15	2025-10-31 07:12:56.12	2025-10-29 08:20:17.87	2025-10-31 07:12:56.125	\N	f	f	136	71	1/4" Трещотки	rf802222		Трещотка реверсивная усиленная изогнутая с резиновой ручкой 1/4''(72зуб.)	null	12	\N	ARRIVED	SOLD	\N	2025-10-29 08:20:17.869	\N	0	0	\N	37	\N	MONOLITH	f	\N
351	SB31020-20251029-115814191-806356/child-12-1761728393425-usqabcd3q	73	\N	\N	2025-10-29 08:59:53.426	2025-10-29 09:00:20.211	\N	f	f	338	95	Щетки ручные	SB31020		Щетка для чистки каналов	null	2	\N	ARRIVED	IN_STORE	\N	2025-10-29 08:59:53.425	\N	0	0	\N	79	\N	MONOLITH	f	\N
334	39775-20251029-115557499-148409	72	\N	\N	2025-10-29 08:55:57.5	2025-10-29 08:55:57.5	\N	f	f	\N	91	3/8-вороток-Гобразный	39775		Вороток Г-образн. (3/8"; 200*75 mm) АвтоDело	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	45	\N	MONOLITH	f	\N
323	ER13130-20251029-113941923-969559/child-1-1761727224318-9gup2z9gk	69	\N	\N	2025-10-29 08:40:24.32	2025-10-29 08:40:32.563	\N	f	f	321	117	КЛЕЩИ ПЕРЕСТАВНЫЕ	ER13130		Клещи переставные ER-13130 универсальные, покрытие черное порошковое 300мм ЭВРИКА 1/36	null	18.18	\N	ARRIVED	IN_STORE	\N	2025-10-29 08:40:24.318	\N	0	0	\N	76	\N	MONOLITH	f	\N
327	270055-20251029-114405650-521796/child-1-1761727472593-uhqrq3wy7	70	\N	\N	2025-10-29 08:44:32.594	2025-10-29 08:44:46.712	\N	f	f	325	95	Щетки ручные	270055		Щётка-мини с прорезиненной рукояткой, щетина из нержавеющей стали	null	3.54	\N	ARRIVED	IN_STORE	\N	2025-10-29 08:44:32.593	\N	0	0	\N	50	\N	MONOLITH	f	\N
324	ER13130-20251029-113941923-969559/child-2-1761727224321-p5wd5jj4t	69	25	2025-10-29 08:40:47.737	2025-10-29 08:40:24.323	2025-10-29 08:40:47.739	\N	f	f	321	117	КЛЕЩИ ПЕРЕСТАВНЫЕ	ER13130		Клещи переставные ER-13130 универсальные, покрытие черное порошковое 300мм ЭВРИКА 1/36	null	18.18	\N	ARRIVED	SOLD	\N	2025-10-29 08:40:24.321	\N	0	0	\N	76	\N	MONOLITH	f	\N
333	39775-20251029-115456974-149224	72	\N	\N	2025-10-29 08:54:56.975	2025-10-29 08:55:57.505	\N	f	f	\N	91	3/8-вороток-Гобразный	39775		Вороток Г-образн. (3/8"; 200*75 mm) АвтоDело	null	\N	\N	SPROUTED	\N	2025-10-29 08:55:41.913	\N	\N	1	0	\N	45	\N	MONOLITH	f	\N
326	270055-20251029-114432575-585461	70	\N	\N	2025-10-29 08:44:32.576	2025-10-29 08:44:32.576	\N	f	f	\N	95	Щетки ручные	270055		Щётка-мини с прорезиненной рукояткой, щетина из нержавеющей стали	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	50	\N	MONOLITH	f	\N
325	270055-20251029-114405650-521796	70	\N	\N	2025-10-29 08:44:05.651	2025-10-29 08:44:32.591	\N	f	f	\N	95	Щетки ручные	270055		Щётка-мини с прорезиненной рукояткой, щетина из нержавеющей стали	null	\N	\N	SPROUTED	\N	2025-10-29 08:44:18.706	\N	\N	1	0	\N	50	\N	MONOLITH	f	\N
328	270055-20251029-114405650-521796/child-2-1761727472596-qey2wmvir	70	\N	\N	2025-10-29 08:44:32.597	2025-10-29 08:44:47.395	\N	f	f	325	95	Щетки ручные	270055		Щётка-мини с прорезиненной рукояткой, щетина из нержавеющей стали	null	3.54	\N	ARRIVED	IN_STORE	\N	2025-10-29 08:44:32.596	\N	0	0	\N	50	\N	MONOLITH	f	\N
329	270055-20251029-114405650-521796/child-3-1761727472599-zwc6db0aw	70	\N	\N	2025-10-29 08:44:32.6	2025-10-29 08:44:44.739	\N	f	f	325	95	Щетки ручные	270055		Щётка-мини с прорезиненной рукояткой, щетина из нержавеющей стали	null	3.54	\N	ARRIVED	IN_STORE	\N	2025-10-29 08:44:32.599	\N	0	0	\N	50	\N	MONOLITH	f	\N
330	270055-20251029-114405650-521796/child-4-1761727472602-c3jo2c89s	70	5	2025-10-29 08:45:08.646	2025-10-29 08:44:32.603	2025-10-29 08:45:08.652	\N	f	f	325	95	Щетки ручные	270055		Щётка-мини с прорезиненной рукояткой, щетина из нержавеющей стали	null	3.54	\N	ARRIVED	SOLD	\N	2025-10-29 08:44:32.602	\N	0	0	\N	50	\N	MONOLITH	f	\N
332	1767545-20251029-114839757-974003	71	\N	\N	2025-10-29 08:48:39.759	2025-10-29 08:48:39.759	\N	f	f	\N	17	Torx_17675	1767545		Бита Force 1767545 T45	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	53	\N	MONOLITH	f	\N
335	39775-20251029-115456974-149224/child-1-1761728157507-ofzhoe268	72	\N	\N	2025-10-29 08:55:57.508	2025-10-29 08:56:11.151	\N	f	f	333	91	3/8-вороток-Гобразный	39775		Вороток Г-образн. (3/8"; 200*75 mm) АвтоDело	null	6.72	\N	ARRIVED	IN_STORE	\N	2025-10-29 08:55:57.507	\N	0	0	\N	45	\N	MONOLITH	f	\N
337	39775-20251029-115456974-149224/child-3-1761728157513-2ztm3jaes	72	12	2025-10-29 08:56:33.436	2025-10-29 08:55:57.513	2025-10-29 08:56:33.437	\N	f	f	333	91	3/8-вороток-Гобразный	39775		Вороток Г-образн. (3/8"; 200*75 mm) АвтоDело	null	6.72	\N	ARRIVED	SOLD	\N	2025-10-29 08:55:57.513	\N	0	0	\N	45	\N	MONOLITH	f	\N
331	1767545-20251029-114742626-900476	71	5	2025-10-29 08:48:58.49	2025-10-29 08:47:42.627	2025-10-29 08:48:58.492	\N	f	f	\N	17	Torx_17675	1767545		Бита Force 1767545 T45	null	3.5	\N	ARRIVED	SOLD	2025-10-29 08:48:12.622	2025-10-29 08:48:39.769	\N	1	0	\N	53	\N	MONOLITH	f	\N
336	39775-20251029-115456974-149224/child-2-1761728157510-ssyz839x3	72	\N	\N	2025-10-29 08:55:57.511	2025-10-29 08:56:11.511	\N	f	f	333	91	3/8-вороток-Гобразный	39775		Вороток Г-образн. (3/8"; 200*75 mm) АвтоDело	null	6.72	\N	ARRIVED	IN_STORE	\N	2025-10-29 08:55:57.51	\N	0	0	\N	45	\N	MONOLITH	f	\N
339	SB31020-20251029-115953387-902658	73	\N	\N	2025-10-29 08:59:53.388	2025-10-29 08:59:53.388	\N	f	f	\N	95	Щетки ручные	SB31020		Щетка для чистки каналов	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	79	\N	MONOLITH	f	\N
338	SB31020-20251029-115814191-806356	73	\N	\N	2025-10-29 08:58:14.192	2025-10-29 08:59:53.394	\N	f	f	\N	95	Щетки ручные	SB31020		Щетка для чистки каналов	null	\N	\N	SPROUTED	\N	2025-10-29 08:58:53.4	\N	\N	1	0	\N	79	\N	MONOLITH	f	\N
346	SB31020-20251029-115814191-806356/child-7-1761728393412-0cgc8ky89	73	\N	\N	2025-10-29 08:59:53.413	2025-10-29 09:00:07.611	\N	f	f	338	95	Щетки ручные	SB31020		Щетка для чистки каналов	null	2	\N	ARRIVED	IN_STORE	\N	2025-10-29 08:59:53.412	\N	0	0	\N	79	\N	MONOLITH	f	\N
345	SB31020-20251029-115814191-806356/child-6-1761728393409-o1c1bohkb	73	\N	\N	2025-10-29 08:59:53.41	2025-10-29 09:00:08.14	\N	f	f	338	95	Щетки ручные	SB31020		Щетка для чистки каналов	null	2	\N	ARRIVED	IN_STORE	\N	2025-10-29 08:59:53.409	\N	0	0	\N	79	\N	MONOLITH	f	\N
341	SB31020-20251029-115814191-806356/child-2-1761728393398-fdndbxyam	73	\N	\N	2025-10-29 08:59:53.399	2025-10-29 09:00:08.995	\N	f	f	338	95	Щетки ручные	SB31020		Щетка для чистки каналов	null	2	\N	ARRIVED	IN_STORE	\N	2025-10-29 08:59:53.398	\N	0	0	\N	79	\N	MONOLITH	f	\N
340	SB31020-20251029-115814191-806356/child-1-1761728393395-pntr65wre	73	\N	\N	2025-10-29 08:59:53.396	2025-10-29 09:00:12.646	\N	f	f	338	95	Щетки ручные	SB31020		Щетка для чистки каналов	null	2	\N	ARRIVED	IN_STORE	\N	2025-10-29 08:59:53.395	\N	0	0	\N	79	\N	MONOLITH	f	\N
344	SB31020-20251029-115814191-806356/child-5-1761728393406-igyks1vyo	73	\N	\N	2025-10-29 08:59:53.407	2025-10-29 09:00:15.14	\N	f	f	338	95	Щетки ручные	SB31020		Щетка для чистки каналов	null	2	\N	ARRIVED	IN_STORE	\N	2025-10-29 08:59:53.407	\N	0	0	\N	79	\N	MONOLITH	f	\N
342	SB31020-20251029-115814191-806356/child-3-1761728393401-fkyl447fn	73	\N	\N	2025-10-29 08:59:53.402	2025-10-29 09:00:17.414	\N	f	f	338	95	Щетки ручные	SB31020		Щетка для чистки каналов	null	2	\N	ARRIVED	IN_STORE	\N	2025-10-29 08:59:53.401	\N	0	0	\N	79	\N	MONOLITH	f	\N
343	SB31020-20251029-115814191-806356/child-4-1761728393404-46lbqye7e	73	\N	\N	2025-10-29 08:59:53.405	2025-10-29 09:00:18.269	\N	f	f	338	95	Щетки ручные	SB31020		Щетка для чистки каналов	null	2	\N	ARRIVED	IN_STORE	\N	2025-10-29 08:59:53.404	\N	0	0	\N	79	\N	MONOLITH	f	\N
359	SB31020-20251029-115814191-806356/child-20-1761728393448-eq6o1py8l	73	\N	\N	2025-10-29 08:59:53.449	2025-10-29 09:00:02.371	\N	f	f	338	95	Щетки ручные	SB31020		Щетка для чистки каналов	null	2	\N	ARRIVED	IN_STORE	\N	2025-10-29 08:59:53.448	\N	0	0	\N	79	\N	MONOLITH	f	\N
358	SB31020-20251029-115814191-806356/child-19-1761728393445-js04gq4i0	73	\N	\N	2025-10-29 08:59:53.446	2025-10-29 09:00:02.837	\N	f	f	338	95	Щетки ручные	SB31020		Щетка для чистки каналов	null	2	\N	ARRIVED	IN_STORE	\N	2025-10-29 08:59:53.446	\N	0	0	\N	79	\N	MONOLITH	f	\N
357	SB31020-20251029-115814191-806356/child-18-1761728393443-nwti8xf55	73	\N	\N	2025-10-29 08:59:53.444	2025-10-29 09:00:03.914	\N	f	f	338	95	Щетки ручные	SB31020		Щетка для чистки каналов	null	2	\N	ARRIVED	IN_STORE	\N	2025-10-29 08:59:53.443	\N	0	0	\N	79	\N	MONOLITH	f	\N
356	SB31020-20251029-115814191-806356/child-17-1761728393439-og4frfsd6	73	\N	\N	2025-10-29 08:59:53.44	2025-10-29 09:00:04.444	\N	f	f	338	95	Щетки ручные	SB31020		Щетка для чистки каналов	null	2	\N	ARRIVED	IN_STORE	\N	2025-10-29 08:59:53.439	\N	0	0	\N	79	\N	MONOLITH	f	\N
355	SB31020-20251029-115814191-806356/child-16-1761728393436-u6elps7wf	73	\N	\N	2025-10-29 08:59:53.437	2025-10-29 09:00:05.058	\N	f	f	338	95	Щетки ручные	SB31020		Щетка для чистки каналов	null	2	\N	ARRIVED	IN_STORE	\N	2025-10-29 08:59:53.436	\N	0	0	\N	79	\N	MONOLITH	f	\N
360	SB31020-20251029-115814191-806356/child-21-1761728393451-6iy1s9k1y	73	5	2025-10-29 09:00:40	2025-10-29 08:59:53.452	2025-10-29 09:00:40.001	\N	f	f	338	95	Щетки ручные	SB31020		Щетка для чистки каналов	null	2	\N	ARRIVED	SOLD	\N	2025-10-29 08:59:53.451	\N	0	0	\N	79	\N	MONOLITH	f	\N
348	SB31020-20251029-115814191-806356/child-9-1761728393417-8i7x2qunr	73	\N	\N	2025-10-29 08:59:53.418	2025-10-29 09:00:05.658	\N	f	f	338	95	Щетки ручные	SB31020		Щетка для чистки каналов	null	2	\N	ARRIVED	IN_STORE	\N	2025-10-29 08:59:53.417	\N	0	0	\N	79	\N	MONOLITH	f	\N
347	SB31020-20251029-115814191-806356/child-8-1761728393414-exxlv4z9n	73	\N	\N	2025-10-29 08:59:53.415	2025-10-29 09:00:07.135	\N	f	f	338	95	Щетки ручные	SB31020		Щетка для чистки каналов	null	2	\N	ARRIVED	IN_STORE	\N	2025-10-29 08:59:53.414	\N	0	0	\N	79	\N	MONOLITH	f	\N
353	SB31020-20251029-115814191-806356/child-14-1761728393431-jx9buwfdc	73	\N	\N	2025-10-29 08:59:53.432	2025-10-29 09:00:16.387	\N	f	f	338	95	Щетки ручные	SB31020		Щетка для чистки каналов	null	2	\N	ARRIVED	IN_STORE	\N	2025-10-29 08:59:53.431	\N	0	0	\N	79	\N	MONOLITH	f	\N
354	SB31020-20251029-115814191-806356/child-15-1761728393433-7i0fvlxh3	73	\N	\N	2025-10-29 08:59:53.434	2025-10-29 09:00:16.875	\N	f	f	338	95	Щетки ручные	SB31020		Щетка для чистки каналов	null	2	\N	ARRIVED	IN_STORE	\N	2025-10-29 08:59:53.433	\N	0	0	\N	79	\N	MONOLITH	f	\N
352	SB31020-20251029-115814191-806356/child-13-1761728393428-b5r4elcvd	73	\N	\N	2025-10-29 08:59:53.429	2025-10-29 09:00:19.503	\N	f	f	338	95	Щетки ручные	SB31020		Щетка для чистки каналов	null	2	\N	ARRIVED	IN_STORE	\N	2025-10-29 08:59:53.428	\N	0	0	\N	79	\N	MONOLITH	f	\N
374	ER01010M-20251029-122518817-925565/child-1-1761729975591-c7kdipafi	79	\N	\N	2025-10-29 09:26:15.592	2025-10-29 09:26:32.644	\N	f	f	372	113	Метчики поштучно	ER01010M		Метчик ER-01010M M10x1 (2шт),в пластиковом футляре ЭВРИКА /1	null	6.48	\N	ARRIVED	IN_STORE	\N	2025-10-29 09:26:15.591	\N	0	0	\N	82	\N	MONOLITH	f	\N
350	SB31020-20251029-115814191-806356/child-11-1761728393423-byq74v3he	73	\N	\N	2025-10-29 08:59:53.424	2025-10-29 09:00:20.898	\N	f	f	338	95	Щетки ручные	SB31020		Щетка для чистки каналов	null	2	\N	ARRIVED	IN_STORE	\N	2025-10-29 08:59:53.423	\N	0	0	\N	79	\N	MONOLITH	f	\N
349	SB31020-20251029-115814191-806356/child-10-1761728393420-svqq54i7i	73	\N	\N	2025-10-29 08:59:53.421	2025-10-29 09:00:21.448	\N	f	f	338	95	Щетки ручные	SB31020		Щетка для чистки каналов	null	2	\N	ARRIVED	IN_STORE	\N	2025-10-29 08:59:53.42	\N	0	0	\N	79	\N	MONOLITH	f	\N
373	ER01010M-20251029-122615575-228541	79	\N	\N	2025-10-29 09:26:15.576	2025-10-29 09:26:15.576	\N	f	f	\N	113	Метчики поштучно	ER01010M		Метчик ER-01010M M10x1 (2шт),в пластиковом футляре ЭВРИКА /1	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	82	\N	MONOLITH	f	\N
362	RF-9T0801-20251029-120356648-152295	74	\N	\N	2025-10-29 09:03:56.652	2025-10-29 09:03:56.652	\N	f	f	\N	118	ТЯГИ	RF-9T0801		Съемник рулевых тяг универсальный 27-42мм, 1/2''	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	80	\N	MONOLITH	f	\N
365	608 745-20251029-120946888-063984/child-1-1761729058585-9itn7lv4l	75	\N	\N	2025-10-29 09:10:58.586	2025-10-29 09:11:10.732	\N	f	f	363	108	трещотки ручные 1/4	608 745		Трещотка 45 зубцов 1/4"	null	18.12	\N	ARRIVED	IN_STORE	\N	2025-10-29 09:10:58.585	\N	0	0	\N	74	\N	MONOLITH	f	\N
372	ER01010M-20251029-122518817-925565	79	\N	\N	2025-10-29 09:25:18.819	2025-10-29 09:26:15.59	\N	f	f	\N	113	Метчики поштучно	ER01010M		Метчик ER-01010M M10x1 (2шт),в пластиковом футляре ЭВРИКА /1	null	\N	\N	SPROUTED	\N	2025-10-29 09:25:39.853	\N	\N	1	0	\N	82	\N	MONOLITH	f	\N
368	Sch-TAP12x1.75-20251029-121733030-228595	76	\N	\N	2025-10-29 09:17:33.031	2025-10-29 09:18:55.382	\N	f	f	\N	113	Метчики поштучно	Sch-TAP12x1.75		Метчик M12x1,75 (3шт)	null	6.51	\N	ARRIVED	IN_STORE	2025-10-29 09:17:59.432	2025-10-29 09:18:23.995	\N	1	0	\N	81	\N	MONOLITH	f	\N
366	608 745-20251029-120946888-063984/child-2-1761729058588-9dhc8z5wa	75	\N	\N	2025-10-29 09:10:58.589	2025-10-29 09:11:11.664	\N	f	f	363	108	трещотки ручные 1/4	608 745		Трещотка 45 зубцов 1/4"	null	18.12	\N	ARRIVED	IN_STORE	\N	2025-10-29 09:10:58.588	\N	0	0	\N	74	\N	MONOLITH	f	\N
369	Sch-TAP12x1.75-20251029-121823982-095238	76	\N	\N	2025-10-29 09:18:23.984	2025-10-29 09:20:12.373	\N	f	f	\N	113	Метчики поштучно	Sch-TAP12x1.75		Метчик M12x1,75 (3шт)	null	\N	\N	CANDIDATE	\N	2025-10-29 09:20:12.372	\N	\N	1	0	\N	81	\N	MONOLITH	f	\N
364	608 745-20251029-121058575-718103	75	\N	\N	2025-10-29 09:10:58.577	2025-10-29 09:10:58.577	\N	f	f	\N	108	трещотки ручные 1/4	608 745		Трещотка 45 зубцов 1/4"	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	74	\N	MONOLITH	f	\N
363	608 745-20251029-120946888-063984	75	\N	\N	2025-10-29 09:09:46.889	2025-10-29 09:10:58.583	\N	f	f	\N	108	трещотки ручные 1/4	608 745		Трещотка 45 зубцов 1/4"	null	\N	\N	SPROUTED	\N	2025-10-29 09:10:03.918	\N	\N	1	0	\N	74	\N	MONOLITH	f	\N
367	608 745-20251029-120946888-063984/child-3-1761729058591-hmf31muk1	75	\N	\N	2025-10-29 09:10:58.592	2025-10-29 09:11:13.388	\N	f	f	363	108	трещотки ручные 1/4	608 745		Трещотка 45 зубцов 1/4"	null	18.12	\N	ARRIVED	IN_STORE	\N	2025-10-29 09:10:58.591	\N	0	0	\N	74	\N	MONOLITH	f	\N
371	Sch-TAP10x1,5-20251029-122353420-743235	78	\N	\N	2025-10-29 09:23:53.422	2025-10-29 09:23:53.422	\N	f	f	\N	113	Метчики поштучно	Sch-TAP10x1,5		Метчик M10x1,5 (3шт)	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	82	\N	MONOLITH	f	\N
376	Sch-TAP9x1-20251029-122918018-814974	80	\N	\N	2025-10-29 09:29:18.019	2025-10-29 09:29:49.523	\N	f	f	\N	113	Метчики поштучно	Sch-TAP9x1		Метчик M9x1 (3шт)	null	5.25	\N	ARRIVED	IN_STORE	2025-10-29 09:29:29.916	2025-10-29 09:29:48.056	\N	1	0	\N	83	\N	MONOLITH	f	\N
375	ER01010M-20251029-122518817-925565/child-2-1761729975594-3422ajrn8	79	\N	\N	2025-10-29 09:26:15.595	2025-10-29 09:26:33.553	\N	f	f	372	113	Метчики поштучно	ER01010M		Метчик ER-01010M M10x1 (2шт),в пластиковом футляре ЭВРИКА /1	null	6.48	\N	ARRIVED	IN_STORE	\N	2025-10-29 09:26:15.594	\N	0	0	\N	82	\N	MONOLITH	f	\N
377	Sch-TAP9x1-20251029-122948043-131968	80	\N	\N	2025-10-29 09:29:48.045	2025-10-29 09:29:48.045	\N	f	f	\N	113	Метчики поштучно	Sch-TAP9x1		Метчик M9x1 (3шт)	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	83	\N	MONOLITH	f	\N
370	Sch-TAP10x1,5-20251029-122322797-994172	78	\N	\N	2025-10-29 09:23:22.798	2025-10-29 09:23:56.038	\N	f	f	\N	113	Метчики поштучно	Sch-TAP10x1,5		Метчик M10x1,5 (3шт)	null	5.16	\N	ARRIVED	IN_STORE	2025-10-29 09:23:34.925	2025-10-29 09:23:53.432	\N	1	0	\N	82	\N	MONOLITH	f	\N
361	RF-9T0801-20251029-120314988-684712	74	\N	\N	2025-10-29 09:03:14.99	2025-10-29 09:41:53.582	\N	f	f	\N	118	ТЯГИ	RF-9T0801		Съемник рулевых тяг универсальный 27-42мм, 1/2''	null	21.6	\N	ARRIVED	IN_STORE	2025-10-29 09:03:35.354	2025-10-29 09:03:56.66	\N	1	0	\N	80	\N	MONOLITH	f	\N
379	Sch-TAP8x1,25-20251029-123156617-781330	81	\N	\N	2025-10-29 09:31:56.619	2025-10-29 09:31:56.619	\N	f	f	\N	113	Метчики поштучно	Sch-TAP8x1,25		Метчик M8x1,25 (3шт)	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	84	\N	MONOLITH	f	\N
381	Sch-TAP8x1-20251029-123345240-842715	82	\N	\N	2025-10-29 09:33:45.241	2025-10-29 09:33:45.241	\N	f	f	\N	113	Метчики поштучно	Sch-TAP8x1		Метчик M8x1 (3шт)	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	84	\N	MONOLITH	f	\N
378	Sch-TAP8x1,25-20251029-123118267-102060	81	\N	\N	2025-10-29 09:31:18.269	2025-10-29 09:31:58.242	\N	f	f	\N	113	Метчики поштучно	Sch-TAP8x1,25		Метчик M8x1,25 (3шт)	null	4.29	\N	ARRIVED	IN_STORE	2025-10-29 09:31:31.284	2025-10-29 09:31:56.631	\N	1	0	\N	84	\N	MONOLITH	f	\N
383	FK-46510027-20251029-125701766-780292	83	\N	\N	2025-10-29 09:57:01.768	2025-10-29 09:57:01.768	\N	f	f	\N	41	3/4 длинные	FK-46510027		Головка ударная глубокая 27мм (6гр.), 3/4''	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	85	\N	MONOLITH	f	\N
392	JCB-75510-20251030-105610327-105256	88	\N	\N	2025-10-30 07:56:10.328	2025-10-30 07:56:10.328	\N	f	f	\N	97	комбинир. поштучно	JCB-75510		Ключ комбинированный 10мм	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	89	\N	MONOLITH	f	\N
382	FK-46510027-20251029-125613507-441653	83	18	2025-10-29 09:57:26.18	2025-10-29 09:56:13.513	2025-10-29 09:57:26.181	\N	f	f	\N	41	3/4 длинные	FK-46510027		Головка ударная глубокая 27мм (6гр.), 3/4''	null	10.92	\N	ARRIVED	SOLD	2025-10-29 09:56:30.534	2025-10-29 09:57:01.78	\N	1	0	\N	85	\N	MONOLITH	f	\N
384	KACN160B-20251029-130815233-515657	28	\N	\N	2025-10-29 10:08:15.235	2025-10-29 10:08:15.235	\N	f	f	\N	66	ШАРНИР-УДАРНЫЙ	KACN160B		Шарнир ударный 1/2"х62мм TOPTUL	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	33	\N	MONOLITH	f	\N
391	JCB-75510-20251030-105428376-843008	88	\N	\N	2025-10-30 07:54:28.377	2025-10-30 07:56:10.333	\N	f	f	\N	97	комбинир. поштучно	JCB-75510		Ключ комбинированный 10мм	null	\N	\N	SPROUTED	\N	2025-10-30 07:54:53.019	\N	\N	1	0	\N	89	\N	MONOLITH	f	\N
386	HZ 25.1.281W-20251029-134424081-887234	85	\N	\N	2025-10-29 10:44:24.083	2025-10-29 10:44:24.083	\N	f	f	\N	121	СЪЕМНИК ДВОРНИКОВ	HZ 25.1.281W		Съемник клемм АКБ и поводков стеклоочистителя Хорекс Авто	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	87	\N	MONOLITH	f	\N
385	HZ 25.1.281W-20251029-134355331-387293	85	24	2025-10-29 10:48:31.487	2025-10-29 10:43:55.337	2025-10-29 10:48:31.489	\N	f	f	\N	121	СЪЕМНИК ДВОРНИКОВ	HZ 25.1.281W		Съемник клемм АКБ и поводков стеклоочистителя Хорекс Авто	null	16.13	\N	ARRIVED	SOLD	2025-10-29 10:44:10.759	2025-10-29 10:44:24.089	\N	1	0	\N	87	\N	MONOLITH	f	\N
388	628 745-20251029-135102444-739414	86	\N	\N	2025-10-29 10:51:02.446	2025-10-29 10:51:02.446	\N	f	f	\N	110	трещотки ручные 1/2	628 745		Трещотка 45 зубцов 1/2"	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	88	\N	MONOLITH	f	\N
387	628 745-20251029-135011386-012319	86	40	2025-10-29 10:51:22.974	2025-10-29 10:50:11.387	2025-10-29 10:51:22.975	\N	f	f	\N	110	трещотки ручные 1/2	628 745		Трещотка 45 зубцов 1/2"	null	31	\N	ARRIVED	SOLD	2025-10-29 10:50:21.272	2025-10-29 10:51:02.458	\N	1	0	\N	88	\N	MONOLITH	f	\N
390	R7300381-20251030-104800473-531832	87	\N	\N	2025-10-30 07:48:00.475	2025-10-30 07:48:00.475	\N	f	f	\N	104	ДИНАМОМЕТРИЧЕСКИЕ КЛЮЧИ	R7300381		ключ динамометрический! 3/8 5-25нм, 72 зуба, в кейсе\\ R7300381 ARNEZI	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	71	\N	MONOLITH	f	\N
395	JCB-75510-20251030-105428376-843008/child-3-1761810970341-w40yp927g	88	\N	\N	2025-10-30 07:56:10.342	2025-10-30 07:56:28.209	\N	f	f	391	97	комбинир. поштучно	JCB-75510		Ключ комбинированный 10мм	null	1.38	\N	ARRIVED	IN_STORE	\N	2025-10-30 07:56:10.341	\N	0	0	\N	89	\N	MONOLITH	f	\N
399	JCB-75510-20251030-105428376-843008/child-7-1761810970350-x9sel6nxa	88	\N	\N	2025-10-30 07:56:10.351	2025-10-30 07:56:27.25	\N	f	f	391	97	комбинир. поштучно	JCB-75510		Ключ комбинированный 10мм	null	1.38	\N	ARRIVED	IN_STORE	\N	2025-10-30 07:56:10.35	\N	0	0	\N	89	\N	MONOLITH	f	\N
396	JCB-75510-20251030-105428376-843008/child-4-1761810970343-v9is4tuzk	88	\N	\N	2025-10-30 07:56:10.344	2025-10-30 07:56:29.155	\N	f	f	391	97	комбинир. поштучно	JCB-75510		Ключ комбинированный 10мм	null	1.38	\N	ARRIVED	IN_STORE	\N	2025-10-30 07:56:10.344	\N	0	0	\N	89	\N	MONOLITH	f	\N
408	JCB-75508-20251030-105849020-999847/child-3-1761811612972-tyl8d8zm0	89	3	2025-10-30 08:31:38.502	2025-10-30 08:06:52.973	2025-10-30 08:31:38.503	\N	f	f	404	97	комбинир. поштучно	JCB-75508		Ключ комбинированный 8мм	null	1.08	\N	ARRIVED	SOLD	\N	2025-10-30 08:06:52.972	\N	0	0	\N	90	\N	MONOLITH	f	\N
400	JCB-75510-20251030-105428376-843008/child-8-1761810970352-2nhoqk9ac	88	\N	\N	2025-10-30 07:56:10.353	2025-10-30 07:56:29.838	\N	f	f	391	97	комбинир. поштучно	JCB-75510		Ключ комбинированный 10мм	null	1.38	\N	ARRIVED	IN_STORE	\N	2025-10-30 07:56:10.352	\N	0	0	\N	89	\N	MONOLITH	f	\N
401	JCB-75510-20251030-105428376-843008/child-9-1761810970354-gqf3hagfi	88	\N	\N	2025-10-30 07:56:10.355	2025-10-30 07:56:30.413	\N	f	f	391	97	комбинир. поштучно	JCB-75510		Ключ комбинированный 10мм	null	1.38	\N	ARRIVED	IN_STORE	\N	2025-10-30 07:56:10.354	\N	0	0	\N	89	\N	MONOLITH	f	\N
397	JCB-75510-20251030-105428376-843008/child-5-1761810970345-flt22qakb	88	\N	\N	2025-10-30 07:56:10.346	2025-10-30 07:56:31.108	\N	f	f	391	97	комбинир. поштучно	JCB-75510		Ключ комбинированный 10мм	null	1.38	\N	ARRIVED	IN_STORE	\N	2025-10-30 07:56:10.345	\N	0	0	\N	89	\N	MONOLITH	f	\N
393	JCB-75510-20251030-105428376-843008/child-1-1761810970335-z3kvkhqdx	88	\N	\N	2025-10-30 07:56:10.336	2025-10-30 07:56:31.777	\N	f	f	391	97	комбинир. поштучно	JCB-75510		Ключ комбинированный 10мм	null	1.38	\N	ARRIVED	IN_STORE	\N	2025-10-30 07:56:10.335	\N	0	0	\N	89	\N	MONOLITH	f	\N
394	JCB-75510-20251030-105428376-843008/child-2-1761810970338-lh6122nis	88	\N	\N	2025-10-30 07:56:10.339	2025-10-30 07:56:32.382	\N	f	f	391	97	комбинир. поштучно	JCB-75510		Ключ комбинированный 10мм	null	1.38	\N	ARRIVED	IN_STORE	\N	2025-10-30 07:56:10.338	\N	0	0	\N	89	\N	MONOLITH	f	\N
398	JCB-75510-20251030-105428376-843008/child-6-1761810970348-823acbt7r	88	\N	\N	2025-10-30 07:56:10.349	2025-10-30 07:56:33.046	\N	f	f	391	97	комбинир. поштучно	JCB-75510		Ключ комбинированный 10мм	null	1.38	\N	ARRIVED	IN_STORE	\N	2025-10-30 07:56:10.348	\N	0	0	\N	89	\N	MONOLITH	f	\N
402	JCB-75510-20251030-105428376-843008/child-10-1761810970356-w1ys3a4wr	88	3.5	2025-10-30 07:57:05.158	2025-10-30 07:56:10.357	2025-10-30 07:57:05.159	\N	f	f	391	97	комбинир. поштучно	JCB-75510		Ключ комбинированный 10мм	null	1.38	\N	ARRIVED	SOLD	\N	2025-10-30 07:56:10.356	\N	0	0	\N	89	\N	MONOLITH	f	\N
403	JCB-75510-20251030-105428376-843008/child-11-1761810970358-36skweuni	88	3.5	2025-10-30 07:56:56.64	2025-10-30 07:56:10.359	2025-10-30 07:56:56.641	\N	f	f	391	97	комбинир. поштучно	JCB-75510		Ключ комбинированный 10мм	null	1.38	\N	ARRIVED	SOLD	\N	2025-10-30 07:56:10.358	\N	0	0	\N	89	\N	MONOLITH	f	\N
404	JCB-75508-20251030-105849020-999847	89	\N	\N	2025-10-30 07:58:49.022	2025-10-30 08:06:52.964	\N	f	f	\N	97	комбинир. поштучно	JCB-75508		Ключ комбинированный 8мм	null	\N	\N	SPROUTED	\N	2025-10-30 08:05:51.461	\N	\N	1	0	\N	90	\N	MONOLITH	f	\N
405	JCB-75508-20251030-110652948-143201	89	\N	\N	2025-10-30 08:06:52.949	2025-10-30 08:06:52.949	\N	f	f	\N	97	комбинир. поштучно	JCB-75508		Ключ комбинированный 8мм	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	90	\N	MONOLITH	f	\N
389	R7300381-20251030-104702763-940273	87	\N	\N	2025-10-30 07:47:02.764	2025-11-03 08:24:21.541	\N	f	f	\N	104	ДИНАМОМЕТРИЧЕСКИЕ КЛЮЧИ	R7300381		ключ динамометрический! 3/8 5-25нм, 72 зуба, в кейсе\\ R7300381 ARNEZI	null	71.64	\N	ARRIVED	IN_STORE	2025-10-30 07:47:28.741	2025-10-30 07:48:00.488	\N	1	0	\N	71	\N	MONOLITH	f	\N
420	RF-8143-20251030-111401610-877281/child-6-1761812170777-z1jetpiuj	90	5	2025-10-30 08:32:06.002	2025-10-30 08:16:10.778	2025-10-30 08:32:06.003	\N	f	f	410	122	Битодержатели-рукоятки	RF-8143		Рукоятка для головок 1/4''(6''-150мм)	null	1.74	\N	ARRIVED	SOLD	\N	2025-10-30 08:16:10.777	\N	0	0	\N	116	\N	MONOLITH	f	\N
418	RF-8143-20251030-111401610-877281/child-4-1761812170773-yz9n84rd6	90	\N	\N	2025-10-30 08:16:10.774	2025-10-30 08:16:21.508	\N	f	f	410	122	Битодержатели-рукоятки	RF-8143		Рукоятка для головок 1/4''(6''-150мм)	null	1.74	\N	ARRIVED	IN_STORE	\N	2025-10-30 08:16:10.773	\N	0	0	\N	116	\N	MONOLITH	f	\N
415	RF-8143-20251030-111401610-877281/child-1-1761812170763-i0lv61296	90	\N	\N	2025-10-30 08:16:10.764	2025-10-30 08:16:19.306	\N	f	f	410	122	Битодержатели-рукоятки	RF-8143		Рукоятка для головок 1/4''(6''-150мм)	null	1.74	\N	ARRIVED	IN_STORE	\N	2025-10-30 08:16:10.763	\N	0	0	\N	116	\N	MONOLITH	f	\N
411	608815-20251030-111520341-693042	91	\N	\N	2025-10-30 08:15:20.343	2025-10-30 08:15:20.343	\N	f	f	\N	122	Битодержатели-рукоятки	608815		Рукоятка 150 мм 1/4	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	116	\N	MONOLITH	f	\N
409	608815-20251030-111334191-406815	91	\N	\N	2025-10-30 08:13:34.192	2025-10-30 08:15:20.356	\N	f	f	\N	122	Битодержатели-рукоятки	608815		Рукоятка 150 мм 1/4	null	\N	\N	SPROUTED	\N	2025-10-30 08:14:29.15	\N	\N	1	0	\N	116	\N	MONOLITH	f	\N
424	600 057-20251030-113356120-396444/child-2-1761813339346-zg3ruu6fl	92	2	2025-10-30 08:36:11.936	2025-10-30 08:35:39.347	2025-10-30 08:36:11.937	\N	f	f	421	36	1/4 короткие	600 057		Головка шестигранная 7 мм 1/4"	null	1.74	\N	ARRIVED	SOLD	\N	2025-10-30 08:35:39.346	\N	0	0	\N	117	\N	MONOLITH	f	\N
412	608815-20251030-111334191-406815/child-1-1761812120357-plgliho1g	91	\N	\N	2025-10-30 08:15:20.359	2025-10-30 08:15:29.572	\N	f	f	409	122	Битодержатели-рукоятки	608815		Рукоятка 150 мм 1/4	null	4.68	\N	ARRIVED	IN_STORE	\N	2025-10-30 08:15:20.358	\N	0	0	\N	116	\N	MONOLITH	f	\N
416	RF-8143-20251030-111401610-877281/child-2-1761812170765-cp666kosa	90	\N	\N	2025-10-30 08:16:10.766	2025-10-30 08:16:20.127	\N	f	f	410	122	Битодержатели-рукоятки	RF-8143		Рукоятка для головок 1/4''(6''-150мм)	null	1.74	\N	ARRIVED	IN_STORE	\N	2025-10-30 08:16:10.765	\N	0	0	\N	116	\N	MONOLITH	f	\N
419	RF-8143-20251030-111401610-877281/child-5-1761812170775-zmf6e16n5	90	\N	\N	2025-10-30 08:16:10.776	2025-10-30 08:16:22.116	\N	f	f	410	122	Битодержатели-рукоятки	RF-8143		Рукоятка для головок 1/4''(6''-150мм)	null	1.74	\N	ARRIVED	IN_STORE	\N	2025-10-30 08:16:10.775	\N	0	0	\N	116	\N	MONOLITH	f	\N
413	608815-20251030-111334191-406815/child-2-1761812120361-rlp2gsr05	91	\N	\N	2025-10-30 08:15:20.362	2025-10-30 08:15:30.367	\N	f	f	409	122	Битодержатели-рукоятки	608815		Рукоятка 150 мм 1/4	null	4.68	\N	ARRIVED	IN_STORE	\N	2025-10-30 08:15:20.361	\N	0	0	\N	116	\N	MONOLITH	f	\N
414	RF-8143-20251030-111610755-273649	90	\N	\N	2025-10-30 08:16:10.757	2025-10-30 08:16:10.757	\N	f	f	\N	122	Битодержатели-рукоятки	RF-8143		Рукоятка для головок 1/4''(6''-150мм)	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	116	\N	MONOLITH	f	\N
410	RF-8143-20251030-111401610-877281	90	\N	\N	2025-10-30 08:14:01.612	2025-10-30 08:16:10.762	\N	f	f	\N	122	Битодержатели-рукоятки	RF-8143		Рукоятка для головок 1/4''(6''-150мм)	null	\N	\N	SPROUTED	\N	2025-10-30 08:14:29.746	\N	\N	1	0	\N	116	\N	MONOLITH	f	\N
422	600 057-20251030-113539294-986949	92	\N	\N	2025-10-30 08:35:39.295	2025-10-30 08:35:39.295	\N	f	f	\N	36	1/4 короткие	600 057		Головка шестигранная 7 мм 1/4"	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	117	\N	MONOLITH	f	\N
421	600 057-20251030-113356120-396444	92	\N	\N	2025-10-30 08:33:56.122	2025-10-30 08:35:39.339	\N	f	f	\N	36	1/4 короткие	600 057		Головка шестигранная 7 мм 1/4"	null	\N	\N	SPROUTED	\N	2025-10-30 08:34:16.522	\N	\N	1	0	\N	117	\N	MONOLITH	f	\N
417	RF-8143-20251030-111401610-877281/child-3-1761812170767-7jhxfz7hs	90	\N	\N	2025-10-30 08:16:10.768	2025-10-30 08:16:20.989	\N	f	f	410	122	Битодержатели-рукоятки	RF-8143		Рукоятка для головок 1/4''(6''-150мм)	null	1.74	\N	ARRIVED	IN_STORE	\N	2025-10-30 08:16:10.767	\N	0	0	\N	116	\N	MONOLITH	f	\N
407	JCB-75508-20251030-105849020-999847/child-2-1761811612969-njpjy4o7a	89	\N	\N	2025-10-30 08:06:52.97	2025-10-30 08:07:22.42	\N	f	f	404	97	комбинир. поштучно	JCB-75508		Ключ комбинированный 8мм	null	1.08	\N	ARRIVED	IN_STORE	\N	2025-10-30 08:06:52.97	\N	0	0	\N	90	\N	MONOLITH	f	\N
406	JCB-75508-20251030-105849020-999847/child-1-1761811612966-mt6jek246	89	\N	\N	2025-10-30 08:06:52.967	2025-10-30 08:07:22.921	\N	f	f	404	97	комбинир. поштучно	JCB-75508		Ключ комбинированный 8мм	null	1.08	\N	ARRIVED	IN_STORE	\N	2025-10-30 08:06:52.966	\N	0	0	\N	90	\N	MONOLITH	f	\N
153	80634-20251027-141709789-809795/child-7-1761563873635-9q3pw5rrm	34	\N	\N	2025-10-27 11:17:53.636	2025-10-30 08:40:17.25	\N	f	f	145	82	БЕГУНКИ (Адаптер-переходник 3/8''(F)x1/2''(M))	80634		Адаптер-переходник 3/8''(F)x1/2''(M)	null	5.1	\N	ARRIVED	IN_STORE	\N	2025-10-27 11:17:53.635	\N	0	0	\N	40	\N	MONOLITH	f	\N
426	BAEA0807-20251030-113932386-676978	93	\N	\N	2025-10-30 08:39:32.388	2025-10-30 08:39:32.388	\N	f	f	\N	36	1/4 короткие	BAEA0807		Головка 1/4" 7мм 6гр.TOPTUL	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	117	\N	MONOLITH	f	\N
423	600 057-20251030-113356120-396444/child-1-1761813339342-orvqx5iji	92	\N	\N	2025-10-30 08:35:39.344	2025-10-30 08:35:57.47	\N	f	f	421	36	1/4 короткие	600 057		Головка шестигранная 7 мм 1/4"	null	1.74	\N	ARRIVED	IN_STORE	\N	2025-10-30 08:35:39.343	\N	0	0	\N	117	\N	MONOLITH	f	\N
425	BAEA0807-20251030-113758664-111563	93	\N	\N	2025-10-30 08:37:58.666	2025-10-30 08:39:32.403	\N	f	f	\N	36	1/4 короткие	BAEA0807		Головка 1/4" 7мм 6гр.TOPTUL	null	\N	\N	SPROUTED	\N	2025-10-30 08:38:46.015	\N	\N	1	0	\N	117	\N	MONOLITH	f	\N
157	80634-20251027-141709789-809795/child-11-1761563873646-8pcdzojmh	34	\N	\N	2025-10-27 11:17:53.647	2025-10-30 08:40:12.872	\N	f	f	145	82	БЕГУНКИ (Адаптер-переходник 3/8''(F)x1/2''(M))	80634		Адаптер-переходник 3/8''(F)x1/2''(M)	null	5.1	\N	ARRIVED	IN_STORE	\N	2025-10-27 11:17:53.646	\N	0	0	\N	40	\N	MONOLITH	f	\N
126	40290-20251025-151659623-522743/child-3-1761394683717-5x4bouxil	29	\N	\N	2025-10-25 12:18:03.718	2025-10-30 08:41:10.958	\N	f	f	122	69	лямбда	40290		Головка разрезная для монтажа кислородного датчика 22 мм ½	null	12.42	\N	ARRIVED	IN_STORE	\N	2025-10-25 12:18:03.717	\N	0	0	\N	35	\N	MONOLITH	f	\N
430	BAEA0807-20251030-113758664-111563/child-4-1761813572414-c63ltl58e	93	\N	\N	2025-10-30 08:39:32.415	2025-11-02 10:24:17.961	\N	f	f	425	36	1/4 короткие	BAEA0807		Головка 1/4" 7мм 6гр.TOPTUL	null	0.92	\N	ARRIVED	IN_STORE	\N	2025-10-30 08:39:32.414	\N	0	0	\N	117	\N	MONOLITH	f	\N
431	BAEA0807-20251030-113758664-111563/child-5-1761813572416-4i6g1n40e	93	\N	\N	2025-10-30 08:39:32.417	2025-11-02 10:24:21.579	\N	f	f	425	36	1/4 короткие	BAEA0807		Головка 1/4" 7мм 6гр.TOPTUL	null	0.92	\N	ARRIVED	IN_STORE	\N	2025-10-30 08:39:32.416	\N	0	0	\N	117	\N	MONOLITH	f	\N
441	603 008-20251030-130335383-997210	96	\N	\N	2025-10-30 10:03:35.385	2025-10-30 10:03:35.385	\N	f	f	\N	130	е-1/4-поштучно	603 008		Головка TORX E8 1/4"	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	120	\N	MONOLITH	f	\N
434	KAJA18C1-20251030-124320280-186760	94	\N	\N	2025-10-30 09:43:20.281	2025-10-30 09:43:20.281	\N	f	f	\N	124	зубила	KAJA18C1		Зубило для пневмомолотка по листовому металлу 178мм TOPTUL	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	118	\N	MONOLITH	f	\N
440	603 008-20251030-130225600-648027	96	\N	\N	2025-10-30 10:02:25.601	2025-10-30 10:03:35.391	\N	f	f	\N	130	е-1/4-поштучно	603 008		Головка TORX E8 1/4"	null	\N	\N	SPROUTED	\N	2025-10-30 10:02:54.254	\N	\N	1	0	\N	120	\N	MONOLITH	f	\N
433	KAJA18C1-20251030-124234795-477958	94	19	2025-10-30 09:43:43.034	2025-10-30 09:42:34.796	2025-10-30 09:43:43.035	\N	f	f	\N	124	зубила	KAJA18C1		Зубило для пневмомолотка по листовому металлу 178мм TOPTUL	null	14.65	\N	ARRIVED	SOLD	2025-10-30 09:42:57.376	2025-10-30 09:43:20.291	\N	1	0	\N	118	\N	MONOLITH	f	\N
436	80942-20251030-125330309-249333	95	\N	\N	2025-10-30 09:53:30.311	2025-10-30 09:53:30.311	\N	f	f	\N	127	perehodnik-1/2 -	80942		Адаптер для головок 1/2''(F)х1/4''(M) L36 мм Force	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	119	\N	MONOLITH	f	\N
435	80942-20251030-125241885-936934	95	\N	\N	2025-10-30 09:52:41.887	2025-10-30 09:53:30.325	\N	f	f	\N	127	perehodnik-1/2 -	80942		Адаптер для головок 1/2''(F)х1/4''(M) L36 мм Force	null	\N	\N	SPROUTED	\N	2025-10-30 09:52:54.803	\N	\N	1	0	\N	119	\N	MONOLITH	f	\N
193	ST5025-20251028-124048225-422533/child-1-1761644503734-p99hnnem9	40	\N	\N	2025-10-28 09:41:43.735	2025-11-02 10:22:58.207	\N	f	f	191	95	Щетки ручные	ST5025		Щетка латунированная STARTUL STANDART (ST5025) (проволочная, пластмассовая рукоятка)	null	2.64	\N	ARRIVED	IN_STORE	\N	2025-10-28 09:41:43.734	\N	0	0	\N	50	\N	MONOLITH	f	\N
194	ST5025-20251028-124048225-422533/child-2-1761644503737-5dfgfptqd	40	\N	\N	2025-10-28 09:41:43.738	2025-11-02 10:23:00.577	\N	f	f	191	95	Щетки ручные	ST5025		Щетка латунированная STARTUL STANDART (ST5025) (проволочная, пластмассовая рукоятка)	null	2.64	\N	ARRIVED	IN_STORE	\N	2025-10-28 09:41:43.737	\N	0	0	\N	50	\N	MONOLITH	f	\N
442	603 008-20251030-130225600-648027/child-1-1761818615392-y0iop7iop	96	\N	\N	2025-10-30 10:03:35.393	2025-10-30 10:03:48.374	\N	f	f	440	130	е-1/4-поштучно	603 008		Головка TORX E8 1/4"	null	1.08	\N	ARRIVED	IN_STORE	\N	2025-10-30 10:03:35.392	\N	0	0	\N	120	\N	MONOLITH	f	\N
437	80942-20251030-125241885-936934/child-1-1761818010326-n20s87tly	95	\N	\N	2025-10-30 09:53:30.327	2025-10-30 09:53:43.287	\N	f	f	435	127	perehodnik-1/2 -	80942		Адаптер для головок 1/2''(F)х1/4''(M) L36 мм Force	null	6.96	\N	ARRIVED	IN_STORE	\N	2025-10-30 09:53:30.326	\N	0	0	\N	119	\N	MONOLITH	f	\N
446	603 008-20251030-130225600-648027/child-5-1761818615402-z6h7isyo9	96	4	2025-10-30 10:04:28.968	2025-10-30 10:03:35.403	2025-10-30 10:04:28.969	\N	f	f	440	130	е-1/4-поштучно	603 008		Головка TORX E8 1/4"	null	1.08	\N	ARRIVED	SOLD	\N	2025-10-30 10:03:35.402	\N	0	0	\N	120	\N	MONOLITH	f	\N
443	603 008-20251030-130225600-648027/child-2-1761818615395-vukpd6wrk	96	\N	\N	2025-10-30 10:03:35.396	2025-10-30 10:03:48.559	\N	f	f	440	130	е-1/4-поштучно	603 008		Головка TORX E8 1/4"	null	1.08	\N	ARRIVED	IN_STORE	\N	2025-10-30 10:03:35.395	\N	0	0	\N	120	\N	MONOLITH	f	\N
438	80942-20251030-125241885-936934/child-2-1761818010328-jadg02dna	95	\N	\N	2025-10-30 09:53:30.329	2025-10-30 09:53:44.086	\N	f	f	435	127	perehodnik-1/2 -	80942		Адаптер для головок 1/2''(F)х1/4''(M) L36 мм Force	null	6.96	\N	ARRIVED	IN_STORE	\N	2025-10-30 09:53:30.328	\N	0	0	\N	119	\N	MONOLITH	f	\N
439	80942-20251030-125241885-936934/child-3-1761818010331-co2hjca5y	95	12	2025-10-30 09:54:04.348	2025-10-30 09:53:30.331	2025-10-30 09:54:04.349	\N	f	f	435	127	perehodnik-1/2 -	80942		Адаптер для головок 1/2''(F)х1/4''(M) L36 мм Force	null	6.96	\N	ARRIVED	SOLD	\N	2025-10-30 09:53:30.331	\N	0	0	\N	119	\N	MONOLITH	f	\N
445	603 008-20251030-130225600-648027/child-4-1761818615400-pmp284ahu	96	4	2025-10-30 10:04:36.785	2025-10-30 10:03:35.401	2025-10-30 10:04:36.786	\N	f	f	440	130	е-1/4-поштучно	603 008		Головка TORX E8 1/4"	null	1.08	\N	ARRIVED	SOLD	\N	2025-10-30 10:03:35.4	\N	0	0	\N	120	\N	MONOLITH	f	\N
444	603 008-20251030-130225600-648027/child-3-1761818615398-6bqxcsbpb	96	\N	\N	2025-10-30 10:03:35.399	2025-10-30 10:03:49.616	\N	f	f	440	130	е-1/4-поштучно	603 008		Головка TORX E8 1/4"	null	1.08	\N	ARRIVED	IN_STORE	\N	2025-10-30 10:03:35.398	\N	0	0	\N	120	\N	MONOLITH	f	\N
201	ST5025-20251028-124048225-422533/child-9-1761644503758-8p4n7hlgd	40	\N	\N	2025-10-28 09:41:43.759	2025-11-02 10:23:11.522	\N	f	f	191	95	Щетки ручные	ST5025		Щетка латунированная STARTUL STANDART (ST5025) (проволочная, пластмассовая рукоятка)	null	2.64	\N	ARRIVED	IN_STORE	\N	2025-10-28 09:41:43.758	\N	0	0	\N	50	\N	MONOLITH	f	\N
202	ST5025-20251028-124048225-422533/child-10-1761644503762-on2da6q22	40	\N	\N	2025-10-28 09:41:43.763	2025-11-02 10:23:12.82	\N	f	f	191	95	Щетки ручные	ST5025		Щетка латунированная STARTUL STANDART (ST5025) (проволочная, пластмассовая рукоятка)	null	2.64	\N	ARRIVED	IN_STORE	\N	2025-10-28 09:41:43.762	\N	0	0	\N	50	\N	MONOLITH	f	\N
294	R7300141-20251029-102930291-188059/child-2-1761723008913-oy1r4vjis	60	\N	\N	2025-10-29 07:30:08.914	2025-11-02 10:23:38.692	\N	f	f	291	104	ДИНАМОМЕТРИЧЕСКИЕ КЛЮЧИ	R7300141		Ключ динамометрический 1/4' 5-25 Нм, 72 зуба, в кейсе L=245мм ARNEZI R7300141	null	58.44	\N	ARRIVED	IN_STORE	\N	2025-10-29 07:30:08.913	\N	0	0	\N	70	\N	MONOLITH	f	\N
448	839 816-20251030-130838332-684591	97	20	2025-10-30 10:11:02.543	2025-10-30 10:08:38.334	2025-10-30 10:11:02.544	\N	f	f	\N	133	гайколомы-гайкоколы	839 816		Гайколом 12-16мм	null	15	\N	ARRIVED	SOLD	2025-10-30 10:08:52.549	2025-10-30 10:09:27.815	\N	1	0	\N	121	\N	MONOLITH	f	\N
447	839 822-20251030-130838211-197743	98	32	2025-10-30 10:11:19.588	2025-10-30 10:08:38.212	2025-10-30 10:11:19.589	\N	f	f	\N	133	гайколомы-гайкоколы	839 822		Гайколом 16-22мм	null	25.74	\N	ARRIVED	SOLD	2025-10-30 10:08:52.118	2025-10-30 10:09:13.618	\N	1	0	\N	121	\N	MONOLITH	f	\N
144	JCB-41082-5-20251027-141159063-689910/child-2-1761563561949-55idin3ey	33	\N	\N	2025-10-27 11:12:41.95	2025-11-02 10:22:31.725	\N	f	f	141	81	1/4" и 1/2"	JCB-41082-5		Набор инструментов 108пр.1/4''&1/2''(6-гран)(4-32мм)	null	105	\N	ARRIVED	IN_STORE	\N	2025-10-27 11:12:41.949	\N	0	0	\N	39	\N	MONOLITH	f	\N
427	BAEA0807-20251030-113758664-111563/child-1-1761813572405-kvsj9s0ei	93	\N	\N	2025-10-30 08:39:32.406	2025-11-02 10:23:43.665	\N	f	f	425	36	1/4 короткие	BAEA0807		Головка 1/4" 7мм 6гр.TOPTUL	null	0.92	\N	ARRIVED	IN_STORE	\N	2025-10-30 08:39:32.405	\N	0	0	\N	117	\N	MONOLITH	f	\N
428	BAEA0807-20251030-113758664-111563/child-2-1761813572408-z6xso8ftf	93	\N	\N	2025-10-30 08:39:32.409	2025-11-02 10:23:46.008	\N	f	f	425	36	1/4 короткие	BAEA0807		Головка 1/4" 7мм 6гр.TOPTUL	null	0.92	\N	ARRIVED	IN_STORE	\N	2025-10-30 08:39:32.408	\N	0	0	\N	117	\N	MONOLITH	f	\N
429	BAEA0807-20251030-113758664-111563/child-3-1761813572411-m79h3fyuq	93	\N	\N	2025-10-30 08:39:32.412	2025-11-02 10:23:49.003	\N	f	f	425	36	1/4 короткие	BAEA0807		Головка 1/4" 7мм 6гр.TOPTUL	null	0.92	\N	ARRIVED	IN_STORE	\N	2025-10-30 08:39:32.411	\N	0	0	\N	117	\N	MONOLITH	f	\N
452	40574-20251102-133430095-770028	99	\N	\N	2025-11-02 10:34:30.097	2025-11-02 10:34:30.097	\N	f	f	\N	135	ПРИТИРКА КЛАПАНОВ	40574		Приспособление для притирки клапанов механическое (для электрической дрели), 6 предметов ("АвтоDело") (40574)	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	122	\N	MONOLITH	f	\N
451	40574-20251102-133331501-211320	99	\N	\N	2025-11-02 10:33:31.503	2025-11-02 10:34:30.104	\N	f	f	\N	135	ПРИТИРКА КЛАПАНОВ	40574		Приспособление для притирки клапанов механическое (для электрической дрели), 6 предметов ("АвтоDело") (40574)	null	\N	\N	SPROUTED	\N	2025-11-02 10:33:49.99	\N	\N	1	0	\N	122	\N	MONOLITH	f	\N
461	JCB-76417-20251102-134911643-212798	104	\N	\N	2025-11-02 10:49:11.644	2025-11-02 10:51:54.085	\N	f	f	\N	136	Г образные ключи HEX/TORX	JCB-76417		Ключ Г-образный 6-гранный 17мм	null	8.34	\N	IN_REQUEST	\N	2025-11-02 10:49:36.974	2025-11-02 10:51:54.084	\N	1	0	\N	127	\N	MONOLITH	f	\N
464	JCB-76419-20251102-135040327-522531	103	\N	\N	2025-11-02 10:50:40.329	2025-11-02 10:50:40.329	\N	f	f	\N	136	Г образные ключи HEX/TORX	JCB-76419		Ключ Г-образный 6-гранный 19мм	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	129	\N	MONOLITH	f	\N
453	40574-20251102-133331501-211320/child-1-1762079670105-vz3r14qoe	99	\N	\N	2025-11-02 10:34:30.106	2025-11-02 10:34:50.617	\N	f	f	451	135	ПРИТИРКА КЛАПАНОВ	40574		Приспособление для притирки клапанов механическое (для электрической дрели), 6 предметов ("АвтоDело") (40574)	null	33.12	\N	ARRIVED	IN_STORE	\N	2025-11-02 10:34:30.105	\N	0	0	\N	122	\N	MONOLITH	f	\N
458	JCB-76413-20251102-134055104-471057/child-2-1762080123037-yamfai4n2	100	10	2025-11-02 10:42:37.547	2025-11-02 10:42:03.039	2025-11-02 10:42:37.548	\N	f	f	455	136	Г образные ключи HEX/TORX	JCB-76413		Ключ Г-образный 6-гранный 13мм	null	8.7	\N	ARRIVED	SOLD	\N	2025-11-02 10:42:03.037	\N	0	0	\N	123	\N	MONOLITH	f	\N
457	JCB-76413-20251102-134055104-471057/child-1-1762080123035-imgesonal	100	\N	\N	2025-11-02 10:42:03.036	2025-11-02 10:42:56.589	\N	f	f	455	136	Г образные ключи HEX/TORX	JCB-76413		Ключ Г-образный 6-гранный 13мм	null	8.7	\N	IN_REQUEST	\N	\N	2025-11-02 10:42:03.035	\N	0	0	\N	123	\N	MONOLITH	f	\N
454	40574-20251102-133331501-211320/child-2-1762079670107-vweg9we0v	99	\N	\N	2025-11-02 10:34:30.108	2025-11-02 10:34:51.555	\N	f	f	451	135	ПРИТИРКА КЛАПАНОВ	40574		Приспособление для притирки клапанов механическое (для электрической дрели), 6 предметов ("АвтоDело") (40574)	null	33.12	\N	ARRIVED	IN_STORE	\N	2025-11-02 10:34:30.107	\N	0	0	\N	122	\N	MONOLITH	f	\N
456	JCB-76413-20251102-134203019-489493	100	\N	\N	2025-11-02 10:42:03.021	2025-11-02 10:42:03.021	\N	f	f	\N	136	Г образные ключи HEX/TORX	JCB-76413		Ключ Г-образный 6-гранный 13мм	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	123	\N	MONOLITH	f	\N
455	JCB-76413-20251102-134055104-471057	100	\N	\N	2025-11-02 10:40:55.107	2025-11-02 10:42:03.034	\N	f	f	\N	136	Г образные ключи HEX/TORX	JCB-76413		Ключ Г-образный 6-гранный 13мм	null	\N	\N	SPROUTED	\N	2025-11-02 10:41:11.091	\N	\N	1	0	\N	123	\N	MONOLITH	f	\N
463	JCB-76419-20251102-134920916-510952	103	\N	\N	2025-11-02 10:49:20.918	2025-11-02 10:50:40.355	\N	f	f	\N	136	Г образные ключи HEX/TORX	JCB-76419		Ключ Г-образный 6-гранный 19мм	null	\N	\N	SPROUTED	\N	2025-11-02 10:49:38.28	\N	\N	1	0	\N	129	\N	MONOLITH	f	\N
460	JCB-76416-20251102-134514257-631476	101	\N	\N	2025-11-02 10:45:14.258	2025-11-02 10:45:14.258	\N	f	f	\N	136	Г образные ключи HEX/TORX	JCB-76416		Ключ Г-образный 6-гранный 16мм	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	126	\N	MONOLITH	f	\N
467	JCB-76418-20251102-135120544-804095	102	\N	\N	2025-11-02 10:51:20.545	2025-11-02 10:51:20.545	\N	f	f	\N	136	Г образные ключи HEX/TORX	JCB-76418		Ключ Г-образный 6-гранный 18мм	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	128	\N	MONOLITH	f	\N
465	JCB-76419-20251102-134920916-510952/child-1-1762080640357-lxca7i4bu	103	\N	\N	2025-11-02 10:50:40.358	2025-11-02 10:51:33.187	\N	f	f	463	136	Г образные ключи HEX/TORX	JCB-76419		Ключ Г-образный 6-гранный 19мм	null	11.7	\N	ARRIVED	IN_STORE	\N	2025-11-02 10:50:40.357	\N	0	0	\N	129	\N	MONOLITH	f	\N
459	JCB-76416-20251102-134415372-427222	101	\N	\N	2025-11-02 10:44:15.373	2025-11-02 10:45:18.056	\N	f	f	\N	136	Г образные ключи HEX/TORX	JCB-76416		Ключ Г-образный 6-гранный 16мм	null	8.7	\N	ARRIVED	IN_STORE	2025-11-02 10:44:29.392	2025-11-02 10:45:14.269	\N	1	0	\N	126	\N	MONOLITH	f	\N
472	RF-60316175-20251102-135552917-177977/child-2-1762080994770-i4v3s7414	105	7	2025-11-02 10:57:02.585	2025-11-02 10:56:34.771	2025-11-02 10:57:02.586	\N	f	f	469	137	зубило	RF-60316175		Зубило с шестигранным основанием 16мм (L-175мм),на пластиковом держателе	null	6.75	\N	ARRIVED	SOLD	\N	2025-11-02 10:56:34.77	\N	0	0	\N	130	\N	MONOLITH	f	\N
466	JCB-76419-20251102-134920916-510952/child-2-1762080640360-rakbtbw66	103	\N	\N	2025-11-02 10:50:40.361	2025-11-02 10:51:34.02	\N	f	f	463	136	Г образные ключи HEX/TORX	JCB-76419		Ключ Г-образный 6-гранный 19мм	null	11.7	\N	ARRIVED	IN_STORE	\N	2025-11-02 10:50:40.36	\N	0	0	\N	129	\N	MONOLITH	f	\N
462	JCB-76418-20251102-134916382-777437	102	\N	\N	2025-11-02 10:49:16.383	2025-11-02 10:51:31.204	\N	f	f	\N	136	Г образные ключи HEX/TORX	JCB-76418		Ключ Г-образный 6-гранный 18мм	null	11.7	\N	ARRIVED	IN_STORE	2025-11-02 10:49:40.679	2025-11-02 10:51:20.547	\N	1	0	\N	128	\N	MONOLITH	f	\N
470	RF-60316175-20251102-135634753-501991	105	\N	\N	2025-11-02 10:56:34.754	2025-11-02 10:56:34.754	\N	f	f	\N	137	зубило	RF-60316175		Зубило с шестигранным основанием 16мм (L-175мм),на пластиковом держателе	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	130	\N	MONOLITH	f	\N
468	JCB-76417-20251102-135154073-887787	104	\N	\N	2025-11-02 10:51:54.074	2025-11-02 10:51:54.074	\N	f	f	\N	136	Г образные ключи HEX/TORX	JCB-76417		Ключ Г-образный 6-гранный 17мм	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	127	\N	MONOLITH	f	\N
469	RF-60316175-20251102-135552917-177977	105	\N	\N	2025-11-02 10:55:52.919	2025-11-02 10:56:34.766	\N	f	f	\N	137	зубило	RF-60316175		Зубило с шестигранным основанием 16мм (L-175мм),на пластиковом держателе	null	\N	\N	SPROUTED	\N	2025-11-02 10:56:03.608	\N	\N	1	0	\N	130	\N	MONOLITH	f	\N
471	RF-60316175-20251102-135552917-177977/child-1-1762080994767-d5wk2bhql	105	\N	\N	2025-11-02 10:56:34.768	2025-11-02 10:56:41.757	\N	f	f	469	137	зубило	RF-60316175		Зубило с шестигранным основанием 16мм (L-175мм),на пластиковом держателе	null	6.75	\N	ARRIVED	IN_STORE	\N	2025-11-02 10:56:34.767	\N	0	0	\N	130	\N	MONOLITH	f	\N
474	669 450-20251102-140455467-600156	106	\N	\N	2025-11-02 11:04:55.469	2025-11-02 11:04:55.469	\N	f	f	\N	138	УДАРНЫЕ АДАПТЕРЫ	669 450		Переходник ударный 3/4"F × 1/2"M	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	131	\N	MONOLITH	f	\N
473	669 450-20251102-140120666-537683	106	\N	\N	2025-11-02 11:01:20.668	2025-11-02 11:04:55.475	\N	f	f	\N	138	УДАРНЫЕ АДАПТЕРЫ	669 450		Переходник ударный 3/4"F × 1/2"M	null	\N	\N	SPROUTED	\N	2025-11-02 11:01:39.266	\N	\N	1	0	\N	131	\N	MONOLITH	f	\N
481	F-8156450MPB-20251102-141624537-097751/child-2-1762082242216-nddfi2f34	107	\N	\N	2025-11-02 11:17:22.217	2025-11-02 11:17:30.457	\N	f	f	478	93	3/4-вороток-Гобразный	F-8156450MPB		Вороток Г-образный двухсторонний ударный CR-Mo 450мм 3/4''	null	22.95	\N	ARRIVED	IN_STORE	\N	2025-11-02 11:17:22.216	\N	0	0	\N	46	\N	MONOLITH	f	\N
485	F-T43001C ST-20251102-142334897-834752/child-1-1762082637672-8yxxkzxuv	108	\N	\N	2025-11-02 11:23:57.674	2025-11-02 11:24:04.185	\N	f	f	483	140	ПОДСТАВКИ 2-3т	F-T43001C ST		Подставка ремонтная 3т (h min 285мм, h max 420мм) (к-т 2шт.)	null	84	\N	ARRIVED	IN_STORE	\N	2025-11-02 11:23:57.673	\N	0	0	\N	132	\N	MONOLITH	f	\N
482	F-8156450MPB-20251102-141624537-097751/child-3-1762082242219-0btalciag	107	30	2025-11-02 11:17:44.517	2025-11-02 11:17:22.219	2025-11-02 11:17:44.518	\N	f	f	478	93	3/4-вороток-Гобразный	F-8156450MPB		Вороток Г-образный двухсторонний ударный CR-Mo 450мм 3/4''	null	22.95	\N	ARRIVED	SOLD	\N	2025-11-02 11:17:22.219	\N	0	0	\N	46	\N	MONOLITH	f	\N
477	669 450-20251102-140120666-537683/child-3-1762081495482-5gqo2bu9f	106	\N	\N	2025-11-02 11:04:55.483	2025-11-02 11:05:15.421	\N	f	f	473	138	УДАРНЫЕ АДАПТЕРЫ	669 450		Переходник ударный 3/4"F × 1/2"M	null	15.36	\N	ARRIVED	IN_STORE	\N	2025-11-02 11:04:55.482	\N	0	0	\N	131	\N	MONOLITH	f	\N
475	669 450-20251102-140120666-537683/child-1-1762081495477-u0l7jth9s	106	\N	\N	2025-11-02 11:04:55.478	2025-11-02 11:05:20.341	\N	f	f	473	138	УДАРНЫЕ АДАПТЕРЫ	669 450		Переходник ударный 3/4"F × 1/2"M	null	15.36	\N	IN_REQUEST	\N	\N	2025-11-02 11:04:55.477	\N	0	0	\N	131	\N	MONOLITH	f	\N
476	669 450-20251102-140120666-537683/child-2-1762081495480-lneh8o4ad	106	\N	\N	2025-11-02 11:04:55.481	2025-11-02 11:05:21.086	\N	f	f	473	138	УДАРНЫЕ АДАПТЕРЫ	669 450		Переходник ударный 3/4"F × 1/2"M	null	15.36	\N	IN_REQUEST	\N	\N	2025-11-02 11:04:55.48	\N	0	0	\N	131	\N	MONOLITH	f	\N
479	F-8156450MPB-20251102-141722196-671111	107	\N	\N	2025-11-02 11:17:22.197	2025-11-02 11:17:22.197	\N	f	f	\N	93	3/4-вороток-Гобразный	F-8156450MPB		Вороток Г-образный двухсторонний ударный CR-Mo 450мм 3/4''	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	46	\N	MONOLITH	f	\N
478	F-8156450MPB-20251102-141624537-097751	107	\N	\N	2025-11-02 11:16:24.539	2025-11-02 11:17:22.212	\N	f	f	\N	93	3/4-вороток-Гобразный	F-8156450MPB		Вороток Г-образный двухсторонний ударный CR-Mo 450мм 3/4''	null	\N	\N	SPROUTED	\N	2025-11-02 11:16:37.93	\N	\N	1	0	\N	46	\N	MONOLITH	f	\N
484	F-T43001C ST-20251102-142357655-264883	108	\N	\N	2025-11-02 11:23:57.657	2025-11-02 11:23:57.657	\N	f	f	\N	140	ПОДСТАВКИ 2-3т	F-T43001C ST		Подставка ремонтная 3т (h min 285мм, h max 420мм) (к-т 2шт.)	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	132	\N	MONOLITH	f	\N
483	F-T43001C ST-20251102-142334897-834752	108	\N	\N	2025-11-02 11:23:34.899	2025-11-02 11:23:57.671	\N	f	f	\N	140	ПОДСТАВКИ 2-3т	F-T43001C ST		Подставка ремонтная 3т (h min 285мм, h max 420мм) (к-т 2шт.)	null	\N	\N	SPROUTED	\N	2025-11-02 11:23:45.283	\N	\N	1	0	\N	132	\N	MONOLITH	f	\N
480	F-8156450MPB-20251102-141624537-097751/child-1-1762082242213-8arx2el0v	107	\N	\N	2025-11-02 11:17:22.214	2025-11-02 11:17:29.942	\N	f	f	478	93	3/4-вороток-Гобразный	F-8156450MPB		Вороток Г-образный двухсторонний ударный CR-Mo 450мм 3/4''	null	22.95	\N	ARRIVED	IN_STORE	\N	2025-11-02 11:17:22.213	\N	0	0	\N	46	\N	MONOLITH	f	\N
486	F-T43001C ST-20251102-142334897-834752/child-2-1762082637676-cjf7opeys	108	95	2025-11-02 11:24:22.458	2025-11-02 11:23:57.677	2025-11-02 11:24:22.46	\N	f	f	483	140	ПОДСТАВКИ 2-3т	F-T43001C ST		Подставка ремонтная 3т (h min 285мм, h max 420мм) (к-т 2шт.)	null	84	\N	ARRIVED	SOLD	\N	2025-11-02 11:23:57.676	\N	0	0	\N	132	\N	MONOLITH	f	\N
487	CAEA1612-20251102-143203642-896328	109	\N	\N	2025-11-02 11:32:03.643	2025-11-02 11:32:03.643	\N	f	f	\N	127	perehodnik-1/2 -	CAEA1612		Переходник 1/2"(F)х3/8(М) TOPTUL	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	133	\N	MONOLITH	f	\N
496	BCFA1660-20251102-143707066-015280	110	\N	\N	2025-11-02 11:37:07.068	2025-11-02 11:37:07.068	\N	f	f	\N	13	1/2_запрессованные	BCFA1660		Головка 1/2" с насадкой TORX T60 TOPTUL	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	134	\N	MONOLITH	f	\N
489	CAEA1612-20251102-143312956-104134	109	\N	\N	2025-11-02 11:33:12.957	2025-11-02 11:33:12.957	\N	f	f	\N	127	perehodnik-1/2 -	CAEA1612		Переходник 1/2"(F)х3/8(М) TOPTUL	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	133	\N	MONOLITH	f	\N
488	CAEA1612-20251102-143221126-057307	109	\N	\N	2025-11-02 11:32:21.127	2025-11-02 11:33:12.963	\N	f	f	\N	127	perehodnik-1/2 -	CAEA1612		Переходник 1/2"(F)х3/8(М) TOPTUL	null	\N	\N	SPROUTED	\N	2025-11-02 11:32:48.805	\N	\N	1	0	\N	133	\N	MONOLITH	f	\N
490	CAEA1612-20251102-143221126-057307/child-1-1762083192964-s941hrskq	109	\N	\N	2025-11-02 11:33:12.965	2025-11-02 11:33:38.962	\N	f	f	488	127	perehodnik-1/2 -	CAEA1612		Переходник 1/2"(F)х3/8(М) TOPTUL	null	3.54	\N	ARRIVED	IN_STORE	\N	2025-11-02 11:33:12.964	\N	0	0	\N	133	\N	MONOLITH	f	\N
494	CAEA1612-20251102-143221126-057307/child-5-1762083192975-fe4at475r	109	5	2025-11-02 11:33:59.358	2025-11-02 11:33:12.976	2025-11-02 11:33:59.359	\N	f	f	488	127	perehodnik-1/2 -	CAEA1612		Переходник 1/2"(F)х3/8(М) TOPTUL	null	3.54	\N	ARRIVED	SOLD	\N	2025-11-02 11:33:12.975	\N	0	0	\N	133	\N	MONOLITH	f	\N
491	CAEA1612-20251102-143221126-057307/child-2-1762083192967-bqw6999jc	109	\N	\N	2025-11-02 11:33:12.968	2025-11-02 11:33:40.317	\N	f	f	488	127	perehodnik-1/2 -	CAEA1612		Переходник 1/2"(F)х3/8(М) TOPTUL	null	3.54	\N	ARRIVED	IN_STORE	\N	2025-11-02 11:33:12.967	\N	0	0	\N	133	\N	MONOLITH	f	\N
492	CAEA1612-20251102-143221126-057307/child-3-1762083192970-upv4ivs5g	109	\N	\N	2025-11-02 11:33:12.971	2025-11-02 11:33:40.867	\N	f	f	488	127	perehodnik-1/2 -	CAEA1612		Переходник 1/2"(F)х3/8(М) TOPTUL	null	3.54	\N	ARRIVED	IN_STORE	\N	2025-11-02 11:33:12.97	\N	0	0	\N	133	\N	MONOLITH	f	\N
493	CAEA1612-20251102-143221126-057307/child-4-1762083192972-ln6ccu26r	109	\N	\N	2025-11-02 11:33:12.974	2025-11-02 11:33:42.146	\N	f	f	488	127	perehodnik-1/2 -	CAEA1612		Переходник 1/2"(F)х3/8(М) TOPTUL	null	3.54	\N	ARRIVED	IN_STORE	\N	2025-11-02 11:33:12.973	\N	0	0	\N	133	\N	MONOLITH	f	\N
497	R7703502-20251102-145344556-771507	111	\N	\N	2025-11-02 11:53:44.558	2025-11-02 11:54:40.498	\N	f	f	\N	144	Самозажимных хомутов	R7703502		Клещи для самозажимных хомутов MUBEA ARNEZI	null	\N	\N	SPROUTED	\N	2025-11-02 11:53:54.027	\N	\N	1	0	\N	135	\N	MONOLITH	f	\N
498	R7703502-20251102-145440480-447183	111	\N	\N	2025-11-02 11:54:40.482	2025-11-02 11:54:40.482	\N	f	f	\N	144	Самозажимных хомутов	R7703502		Клещи для самозажимных хомутов MUBEA ARNEZI	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	135	\N	MONOLITH	f	\N
495	BCFA1660-20251102-143635305-804568	110	13	2025-11-02 11:37:55.549	2025-11-02 11:36:35.306	2025-11-02 11:37:55.55	\N	f	f	\N	13	1/2_запрессованные	BCFA1660		Головка 1/2" с насадкой TORX T60 TOPTUL	null	7.63	\N	ARRIVED	SOLD	2025-11-02 11:36:41.375	2025-11-02 11:37:07.071	\N	1	0	\N	134	\N	MONOLITH	f	\N
501	R7703502-20251102-145344556-771507/child-3-1762084480505-uyouvnbrn	111	\N	\N	2025-11-02 11:54:40.506	2025-11-02 11:54:40.506	\N	f	f	497	144	Самозажимных хомутов	R7703502		Клещи для самозажимных хомутов MUBEA ARNEZI	null	14.04	\N	IN_REQUEST	\N	\N	2025-11-02 11:54:40.505	\N	0	0	\N	135	\N	MONOLITH	f	\N
500	R7703502-20251102-145344556-771507/child-2-1762084480502-2aubbrj64	111	22	2025-11-02 11:55:14.939	2025-11-02 11:54:40.503	2025-11-02 11:55:14.941	\N	f	f	497	144	Самозажимных хомутов	R7703502		Клещи для самозажимных хомутов MUBEA ARNEZI	null	14.04	\N	ARRIVED	SOLD	\N	2025-11-02 11:54:40.502	\N	0	0	\N	135	\N	MONOLITH	f	\N
502	839 822-20251103-112201209-900938	98	\N	\N	2025-11-03 08:22:01.21	2025-11-03 08:22:01.21	\N	f	f	\N	133	гайколомы-гайкоколы	839 822		Гайколом 16-22мм	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	121	\N	MONOLITH	f	\N
503	839 816-20251103-112213012-968419	97	\N	\N	2025-11-03 08:22:13.013	2025-11-03 08:22:13.013	\N	f	f	\N	133	гайколомы-гайкоколы	839 816		Гайколом 12-16мм	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	121	\N	MONOLITH	f	\N
449	839 822-20251030-130913605-354547	98	\N	\N	2025-10-30 10:09:13.607	2025-11-03 08:22:15.85	\N	f	f	\N	133	гайколомы-гайкоколы	839 822		Гайколом 16-22мм	null	25.74	\N	ARRIVED	IN_STORE	2025-11-03 08:21:15.214	2025-11-03 08:22:01.217	\N	1	0	\N	121	\N	MONOLITH	f	\N
450	839 816-20251030-130927803-138734	97	\N	\N	2025-10-30 10:09:27.805	2025-11-03 08:22:16.417	\N	f	f	\N	133	гайколомы-гайкоколы	839 816		Гайколом 12-16мм	null	15	\N	ARRIVED	IN_STORE	2025-11-03 08:21:16.408	2025-11-03 08:22:13.017	\N	1	0	\N	121	\N	MONOLITH	f	\N
505	PRO-6065-20251103-120030437-971505	112	\N	\N	2025-11-03 09:00:30.439	2025-11-03 09:00:30.439	\N	f	f	\N	146	ШПРИЦЫ ЛИТОЛ	PRO-6065		Шприц автомобильный для смазки 400мл PRO STARTUL (PRO-6065) (рычажно-плунжерный, с гибким шлангом и стальной трубкой)	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	136	\N	MONOLITH	f	\N
510	RF-8014750U-20251103-121357714-327955	114	\N	\N	2025-11-03 09:13:57.716	2025-11-03 09:13:57.716	\N	f	f	\N	156	шарнирный 1/2	RF-8014750U		Вороток шарнирный 750мм 1/2''	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	140	\N	MONOLITH	f	\N
516	PA-68-175HS-20251103-122646323-898610	117	\N	\N	2025-11-03 09:26:46.325	2025-11-03 09:26:46.325	\N	f	f	\N	159	поштучно 175мм	PA-68-175HS		Съемник стопорных колец прямой на сжатие (L-175мм), в блистере	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	145	\N	MONOLITH	f	\N
514	FK-56946-20251103-122123426-541835	116	\N	\N	2025-11-03 09:21:23.428	2025-11-03 09:21:23.428	\N	f	f	\N	40	3/4 короткие	FK-56946		Головка 46мм (12гр.), 3/4''	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	142	\N	MONOLITH	f	\N
515	PA-68-175HS-20251103-122549498-160031	117	\N	\N	2025-11-03 09:25:49.499	2025-11-03 09:26:46.331	\N	f	f	\N	159	поштучно 175мм	PA-68-175HS		Съемник стопорных колец прямой на сжатие (L-175мм), в блистере	null	\N	\N	SPROUTED	\N	2025-11-03 09:26:04.499	\N	\N	1	0	\N	145	\N	MONOLITH	f	\N
506	766906-20251103-120542568-027308	113	40	2025-11-03 09:08:10.696	2025-11-03 09:05:42.569	2025-11-03 09:08:10.704	\N	f	f	\N	149	ударно-поворотные отвертки	766906		Отвёртка ударная со вставками 5/16"	null	32	\N	ARRIVED	SOLD	2025-11-03 09:05:56.887	2025-11-03 09:07:50.729	\N	1	0	\N	139	\N	MONOLITH	f	\N
504	PRO-6065-20251103-115953569-425864	112	40	2025-11-03 09:00:58.04	2025-11-03 08:59:53.571	2025-11-03 09:00:58.042	\N	f	f	\N	146	ШПРИЦЫ ЛИТОЛ	PRO-6065		Шприц автомобильный для смазки 400мл PRO STARTUL (PRO-6065) (рычажно-плунжерный, с гибким шлангом и стальной трубкой)	null	29.91	\N	ARRIVED	SOLD	2025-11-03 09:00:13.09	2025-11-03 09:00:30.449	\N	1	0	\N	136	\N	MONOLITH	f	\N
509	RF-8014750U-20251103-121318981-788967	114	38	2025-11-03 09:14:18.906	2025-11-03 09:13:18.982	2025-11-03 09:14:18.907	\N	f	f	\N	156	шарнирный 1/2	RF-8014750U		Вороток шарнирный 750мм 1/2''	null	31.41	\N	ARRIVED	SOLD	2025-11-03 09:13:36.451	2025-11-03 09:13:57.718	\N	1	0	\N	140	\N	MONOLITH	f	\N
508	766906-20251103-120855737-095958	113	\N	\N	2025-11-03 09:08:55.738	2025-11-03 09:08:55.738	\N	f	f	\N	149	ударно-поворотные отвертки	766906		Отвёртка ударная со вставками 5/16"	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	139	\N	MONOLITH	f	\N
512	RF-44519-20251103-121801528-023573	115	\N	\N	2025-11-03 09:18:01.53	2025-11-03 09:18:01.53	\N	f	f	\N	85	6гр	RF-44519		Головка ударная 19мм (6гр.), 1/2''	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	42	\N	MONOLITH	f	\N
507	766906-20251103-120750725-318048	113	\N	\N	2025-11-03 09:07:50.733	2025-11-03 09:08:57.059	\N	f	f	\N	149	ударно-поворотные отвертки	766906		Отвёртка ударная со вставками 5/16"	null	32	\N	ARRIVED	IN_STORE	2025-11-03 09:08:30.289	2025-11-03 09:08:55.749	\N	1	0	\N	139	\N	MONOLITH	f	\N
513	FK-56946-20251103-122008512-047899	116	22	2025-11-03 09:21:40.522	2025-11-03 09:20:08.513	2025-11-03 09:21:40.524	\N	f	f	\N	40	3/4 короткие	FK-56946		Головка 46мм (12гр.), 3/4''	null	16.47	\N	ARRIVED	SOLD	2025-11-03 09:21:04.556	2025-11-03 09:21:23.44	\N	1	0	\N	142	\N	MONOLITH	f	\N
517	PA-68-175HS-20251103-122549498-160031/child-1-1762162006332-lqo2vab9k	117	\N	\N	2025-11-03 09:26:46.333	2025-11-03 09:27:00.793	\N	f	f	515	159	поштучно 175мм	PA-68-175HS		Съемник стопорных колец прямой на сжатие (L-175мм), в блистере	null	8.7	\N	IN_REQUEST	\N	\N	2025-11-03 09:26:46.332	\N	0	0	\N	145	\N	MONOLITH	f	\N
511	RF-44519-20251103-121702091-408061	115	5	2025-11-03 09:18:15.092	2025-11-03 09:17:02.092	2025-11-03 09:18:15.093	\N	f	f	\N	85	6гр	RF-44519		Головка ударная 19мм (6гр.), 1/2''	null	2.07	\N	ARRIVED	SOLD	2025-11-03 09:17:28.744	2025-11-03 09:18:01.558	\N	1	0	\N	42	\N	MONOLITH	f	\N
518	PA-68-175HS-20251103-122549498-160031/child-2-1762162006336-6cxbw3040	117	\N	\N	2025-11-03 09:26:46.336	2025-11-03 09:27:01.22	\N	f	f	515	159	поштучно 175мм	PA-68-175HS		Съемник стопорных колец прямой на сжатие (L-175мм), в блистере	null	8.7	\N	IN_REQUEST	\N	\N	2025-11-03 09:26:46.336	\N	0	0	\N	145	\N	MONOLITH	f	\N
519	PA-68-175HS-20251103-122549498-160031/child-3-1762162006366-mdz3ciyo6	117	13	2025-11-03 09:27:16.56	2025-11-03 09:26:46.367	2025-11-03 09:27:16.561	\N	f	f	515	159	поштучно 175мм	PA-68-175HS		Съемник стопорных колец прямой на сжатие (L-175мм), в блистере	null	8.7	\N	ARRIVED	SOLD	\N	2025-11-03 09:26:46.366	\N	0	0	\N	145	\N	MONOLITH	f	\N
499	R7703502-20251102-145344556-771507/child-1-1762084480499-ae330b65s	111	22	2025-11-03 10:03:55.257	2025-11-02 11:54:40.5	2025-11-03 10:03:55.258	\N	f	f	497	144	Самозажимных хомутов	R7703502		Клещи для самозажимных хомутов MUBEA ARNEZI	null	14.04	\N	ARRIVED	SOLD	\N	2025-11-02 11:54:40.499	\N	0	0	\N	135	\N	MONOLITH	f	\N
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, code, name, description, "categoryId", "createdAt", "updatedAt", "brandId", "spineId", human_path, node_index) FROM stdin;
1	SG-35C14	Пистолет для антикоррозионных покрытий SG-35C14 ECO со шлангом		3	2025-10-24 12:29:55.739	2025-10-24 12:29:55.739	1	1	structure / pnevmatika / instrument / pistolet-dlya-graviteksa / pistolet-pod-graviteksa / sg-35c14	structure/d_pnevmatika/d_instrument/d_pistolet-dlya-graviteksa/s_pistolet-pod-graviteksa/p_sg-35c14
2	622021	Головка двенадцатигранная 21 мм 1/2"		7	2025-10-24 12:39:01.165	2025-10-24 12:39:01.165	2	2	structure / ruchnoy-instrument / golovki-tortsevye / 1-2-korotkie / 12-graney / golovka-21mm-12gr / 622021	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-2-korotkie/d_12-graney/s_golovka-21mm-12gr/p_622021
3	1767540	Бита Torx T40 10 мм. FORCE 1767540		17	2025-10-25 06:45:27.212	2025-10-25 06:45:27.212	3	3	structure / bity / 10mm / dlinnye / torx-17675 / bita-torx-t40h75mm / 1767540	structure/d_bity/d_10mm/d_dlinnye/d_torx-17675/s_bita-torx-t40h75mm/p_1767540
5	FSEB1240	Насадка TORX T40 75мм LONG TOPTUL		17	2025-10-25 06:58:35.356	2025-10-25 06:58:35.356	4	3	structure / bity / 10mm / dlinnye / torx-17675 / bita-torx-t40h75mm / fseb1240	structure/d_bity/d_10mm/d_dlinnye/d_torx-17675/s_bita-torx-t40h75mm/p_fseb1240
4	CAEA1208	Переходник 3/8"(F)х1/4(М) TOPTUL		19	2025-10-25 06:54:09.329	2025-10-25 06:54:09.329	4	4	structure / ruchnoy-instrument / adaptery-perehodniki / perehodnik-3-8 / perehodnik-3-8-f-h1-4-m / caea1208	structure/d_ruchnoy-instrument/d_adaptery-perehodniki/d_perehodnik-3-8/s_perehodnik-3-8-f-h1-4-m/p_caea1208
6	1763040	Бита Torx T40 10 мм. FORCE 1763040		20	2025-10-25 07:10:52.45	2025-10-25 07:10:52.45	3	5	structure / bity / 10mm / korotkie / torx-17630 / bita-torx-t40-10-mm / 1763040	structure/d_bity/d_10mm/d_korotkie/d_torx-17630/s_bita-torx-t40-10-mm/p_1763040
7	R7401001	ARNEZI R7401001 Поддон для слива масла 8 л.		29	2025-10-25 07:32:34.356	2025-10-25 07:32:34.356	5	6	structure / oborudovanie / dlya-zameny-teh-zhidkostey-smazka / sliv-otkachka-masla / taziki / poddon-dlya-sliva-masla-8-l / r7401001	structure/d_oborudovanie/d_dlya-zameny-teh-zhidkostey-smazka/d_sliv-otkachka-masla/d_taziki/s_poddon-dlya-sliva-masla-8-l/p_r7401001
8	ST4581	Заклепочник поворотный усиленный 2,4-4,8мм STARTUL PROFI (ST4581)		32	2025-10-25 07:42:33.091	2025-10-25 07:42:33.091	6	7	structure / ruchnoy-instrument / obschestroitel-nyy-instrument / zaklepochniki / vytyazhnoy / zaklepochnik-povorotnyy / st4581	structure/d_ruchnoy-instrument/d_obschestroitel-nyy-instrument/d_zaklepochniki/d_vytyazhnoy/s_zaklepochnik-povorotnyy/p_st4581
9	622017	Головка двенадцатигранная 17мм 1/2"		7	2025-10-25 07:51:58.432	2025-10-25 07:51:58.432	2	8	structure / ruchnoy-instrument / golovki-tortsevye / 1-2-korotkie / 12-graney / golovka-dvenadtsatigrannaya-17mm-1-2 / 622017	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-2-korotkie/d_12-graney/s_golovka-dvenadtsatigrannaya-17mm-1-2/p_622017
10	BAEB1617	Головка 1/2" 17мм 12гр.TOPTUL		7	2025-10-25 07:55:59.868	2025-10-25 07:55:59.868	4	8	structure / ruchnoy-instrument / golovki-tortsevye / 1-2-korotkie / 12-graney / golovka-dvenadtsatigrannaya-17mm-1-2 / baeb1617	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-2-korotkie/d_12-graney/s_golovka-dvenadtsatigrannaya-17mm-1-2/p_baeb1617
11	54917	Головка 17 мм 12-гранная 1/2DR короткая FORCE 54917		7	2025-10-25 08:02:04.182	2025-10-25 08:02:04.182	3	8	structure / ruchnoy-instrument / golovki-tortsevye / 1-2-korotkie / 12-graney / golovka-dvenadtsatigrannaya-17mm-1-2 / 54917	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-2-korotkie/d_12-graney/s_golovka-dvenadtsatigrannaya-17mm-1-2/p_54917
12	63005B	Набор экстракторов 5пр. FORCE 63005B		47	2025-10-25 08:07:42.602	2025-10-25 08:07:42.602	3	9	structure / metalloobrabotka / ekstraktory / ekstraktory-shpil-ki / nabor-ekstraktorov-5-6pr / 63005b	structure/d_metalloobrabotka/d_ekstraktory/d_ekstraktory-shpil-ki/s_nabor-ekstraktorov-5-6pr/p_63005b
13	YT0590	Набор экстракторов для извлечения обломанных болтов 6пр		47	2025-10-25 08:10:03.267	2025-10-25 08:10:03.267	7	9	structure / metalloobrabotka / ekstraktory / ekstraktory-shpil-ki / nabor-ekstraktorov-5-6pr / yt0590	structure/d_metalloobrabotka/d_ekstraktory/d_ekstraktory-shpil-ki/s_nabor-ekstraktorov-5-6pr/p_yt0590
14	620 017	Головка шестигранная 17мм 1/2"		9	2025-10-25 08:15:56.05	2025-10-25 08:15:56.05	2	10	structure / ruchnoy-instrument / golovki-tortsevye / 1-2-korotkie / 6-graney / golovka-shestigrannaya-17mm-1-2 / 620-017	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-2-korotkie/d_6-graney/s_golovka-shestigrannaya-17mm-1-2/p_620-017
15	54517	Головка 17 мм 6-гранная 1/2DR короткая FORCE 54517		9	2025-10-25 08:19:43.858	2025-10-25 08:19:43.858	3	10	structure / ruchnoy-instrument / golovki-tortsevye / 1-2-korotkie / 6-graney / golovka-shestigrannaya-17mm-1-2 / 54517	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-2-korotkie/d_6-graney/s_golovka-shestigrannaya-17mm-1-2/p_54517
16	BAEA1617	Головка 1/2" 17мм 6гр.TOPTUL		9	2025-10-25 08:25:21.198	2025-10-25 08:25:21.198	4	10	structure / ruchnoy-instrument / golovki-tortsevye / 1-2-korotkie / 6-graney / golovka-shestigrannaya-17mm-1-2 / baea1617	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-2-korotkie/d_6-graney/s_golovka-shestigrannaya-17mm-1-2/p_baea1617
17	rf52508	Головка 8мм (6гр.), 1/4''		36	2025-10-25 08:41:47.656	2025-10-25 08:41:47.656	8	11	structure / ruchnoy-instrument / golovki-tortsevye / 1-4-korotkie / golovka-8mm-6gr-1-4 / rf52508	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-4-korotkie/s_golovka-8mm-6gr-1-4/p_rf52508
18	32332065	Головка-бита Slotted 1.2x6.5 мм. 1/4” FORCE 32332065		48	2025-10-25 08:44:46.017	2025-10-25 08:44:46.017	3	15	structure / bity / iz-naborov / 1-4-zapressovannye / 6-5-shlitsevaya / 32332065	structure/d_bity/d_iz-naborov/d_1-4-zapressovannye/s_6-5-shlitsevaya/p_32332065
19	321322	Головка-бита Philips PH.2 1/4'' FORCE 321322		48	2025-10-25 08:46:47.291	2025-10-25 08:46:47.291	3	18	structure / bity / iz-naborov / 1-4-zapressovannye / ph-2-zapressovanaya / 321322	structure/d_bity/d_iz-naborov/d_1-4-zapressovannye/s_ph-2-zapressovanaya/p_321322
20	JCB-4458510	Головка ударная глубокая 10мм (6гр.), 1/2''		50	2025-10-25 08:59:15.748	2025-10-25 08:59:15.748	9	21	structure / ruchnoy-instrument / golovki-tortsevye / 1-2-dlinnye / 6graney / 10mm-6gr-1-2 / jcb-4458510	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-2-dlinnye/d_6graney/s_10mm-6gr-1-2/p_jcb-4458510
21	825206	Съёмник пистонов обшивки изогнутый 6мм		53	2025-10-25 09:20:44.348	2025-10-25 09:20:44.348	2	22	structure / spetsial-nyy-instrument / salon / s-emnik-pistonov / s-emnik-pistonov-metalicheskie / 825206	structure/d_spetsial-nyy-instrument/d_salon/d_s-emnik-pistonov/s_s-emnik-pistonov-metalicheskie/p_825206
22	FK-905M11	Набор приспособлений (пласт.) для демонтажа внутренней обшивки салона 11пр.		54	2025-10-25 09:26:19.472	2025-10-25 09:26:19.472	10	23	structure / spetsial-nyy-instrument / salon / plastikovye-nabory / demontazha-vnutrenney-obshivki-salona-11pr / fk-905m11	structure/d_spetsial-nyy-instrument/d_salon/d_plastikovye-nabory/s_demontazha-vnutrenney-obshivki-salona-11pr/p_fk-905m11
23	RF-1767555 Premium	Бита TORX T55х75ммL		17	2025-10-25 09:43:22.339	2025-10-25 09:43:22.339	8	24	structure / bity / 10mm / dlinnye / torx-17675 / bita-torx-t55 / rf-1767555-premium	structure/d_bity/d_10mm/d_dlinnye/d_torx-17675/s_bita-torx-t55/p_rf-1767555-premium
24	JCB-4167-5MPB	Набор головок ударных глубоких 16пр.,1/2''6гр.(10,12-19,21,22,24,27,30,32,36мм), в металлическом кейсе		56	2025-10-25 09:51:08.431	2025-10-25 09:51:08.431	9	25	structure / ruchnoy-instrument / golovki-nabory / 1-2-udarnye-udlinennye / nabor-golovok-udarnyh-glubokih-16pr / jcb-4167-5mpb	structure/d_ruchnoy-instrument/d_golovki-nabory/d_1-2-udarnye-udlinennye/s_nabor-golovok-udarnyh-glubokih-16pr/p_jcb-4167-5mpb
25	jcb52510	Головка 10мм (6гр.), 1/4''		36	2025-10-25 10:32:48.957	2025-10-25 10:32:48.957	9	26	structure / ruchnoy-instrument / golovki-tortsevye / 1-4-korotkie / golovka-10mm-1-4 / jcb52510	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-4-korotkie/s_golovka-10mm-1-4/p_jcb52510
26	800 410	Съёмник масляных фильтров ременной Ø60-140 мм		61	2025-10-25 10:37:18.933	2025-10-25 10:37:18.933	2	28	structure / spetsial-nyy-instrument / zamena-masla / universal-nye-s-emniki-maslyanyh-fil-trov / remennoy / s-yomnik-maslyanyh-fil-trov-remennoy-60-140-mm / 800-410	structure/d_spetsial-nyy-instrument/d_zamena-masla/d_universal-nye-s-emniki-maslyanyh-fil-trov/d_remennoy/s_s-yomnik-maslyanyh-fil-trov-remennoy-60-140-mm/p_800-410
27	FK-933T1-12P	Болт к набору для замены сайлентблоков М12		65	2025-10-25 10:47:11.121	2025-10-25 10:47:11.121	10	29	structure / spetsial-nyy-instrument / hodovaya-chast / saylentbloki / shpil-ki / bolt-k-naboru-dlya-zameny-saylentblokov-m12 / fk-933t1-12p	structure/d_spetsial-nyy-instrument/d_hodovaya-chast/d_saylentbloki/d_shpil-ki/s_bolt-k-naboru-dlya-zameny-saylentblokov-m12/p_fk-933t1-12p
28	KACN160B	Шарнир ударный 1/2"х62мм TOPTUL		66	2025-10-25 12:11:19.506	2025-10-25 12:11:19.506	4	33	structure / ruchnoy-instrument / adaptery-perehodniki / sharnir-udarnyy / sharnir-udarnyy-1-2 / kacn160b	structure/d_ruchnoy-instrument/d_adaptery-perehodniki/d_sharnir-udarnyy/s_sharnir-udarnyy-1-2/p_kacn160b
29	40290	Головка разрезная для монтажа кислородного датчика 22 мм ½		69	2025-10-25 12:16:49.096	2025-10-25 12:16:49.096	11	35	structure / spetsial-nyy-instrument / dvigatel / datchiki / lyambda / klyuch-dlya-datchika-lyambda-zond / 40290	structure/d_spetsial-nyy-instrument/d_dvigatel/d_datchiki/d_lyambda/s_klyuch-dlya-datchika-lyambda-zond/p_40290
30	622019	Головка двенадцатигранная 19мм 1/2"		7	2025-10-25 12:20:50.983	2025-10-25 12:20:50.983	2	36	structure / ruchnoy-instrument / golovki-tortsevye / 1-2-korotkie / 12-graney / golovka-19mm-12gr-1-2 / 622019	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-2-korotkie/d_12-graney/s_golovka-19mm-12gr-1-2/p_622019
31	rf802222	Трещотка реверсивная усиленная изогнутая с резиновой ручкой 1/4''(72зуб.)		71	2025-10-25 12:50:02.214	2025-10-25 12:50:02.214	8	37	structure / ruchnoy-instrument / treschotki / 1-4-treschotki / 1-4-treschotka-80222 / rf802222	structure/d_ruchnoy-instrument/d_treschotki/d_1-4-treschotki/s_1-4-treschotka-80222/p_rf802222
32	F-5161MP	Набор ключей комбинированных, 16пр.(6-19, 22, 24мм), в пластиковом держателе		75	2025-10-27 10:48:04.321	2025-10-27 10:48:04.321	12	38	structure / ruchnoy-instrument / klyuchi / kombinirovannye-nabory / nabor-klyuchey-kombinirovannyh-16pr / f-5161mp	structure/d_ruchnoy-instrument/d_klyuchi/d_kombinirovannye-nabory/s_nabor-klyuchey-kombinirovannyh-16pr/p_f-5161mp
33	JCB-41082-5	Набор инструментов 108пр.1/4''&1/2''(6-гран)(4-32мм)		81	2025-10-27 11:11:46.002	2025-10-27 11:11:46.002	9	39	structure / ruchnoy-instrument / nabory-instrumentov / 1-4-i-1-2 / nabor-instrumentov-108pr-1-4-1-2-6-gran / jcb-41082-5	structure/d_ruchnoy-instrument/d_nabory-instrumentov/d_1-4-i-1-2/s_nabor-instrumentov-108pr-1-4-1-2-6-gran/p_jcb-41082-5
34	80634	Адаптер-переходник 3/8''(F)x1/2''(M)		82	2025-10-27 11:17:02.075	2025-10-27 11:17:02.075	3	40	structure / ruchnoy-instrument / adaptery-perehodniki / begunki-adapter-perehodnik-3-8-f-x1-2-m / adapter-perehodnik-3-8-f-x1-2-m / 80634	structure/d_ruchnoy-instrument/d_adaptery-perehodniki/d_begunki-adapter-perehodnik-3-8-f-x1-2-m/s_adapter-perehodnik-3-8-f-x1-2-m/p_80634
35	FK-44836	Головка ударная 36мм (12гр.), 1/2''		86	2025-10-27 11:22:55.499	2025-10-27 11:22:55.499	10	41	structure / ruchnoy-instrument / golovki-tortsevye / 1-2-korotkie / 1-2-korotkie-udarnye / 12gr / golovka-udarnaya-36mm-12gr / fk-44836	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-2-korotkie/d_1-2-korotkie-udarnye/d_12gr/s_golovka-udarnaya-36mm-12gr/p_fk-44836
36	660019	Головка ударная шестигранная 19 мм 1/2"		85	2025-10-27 11:26:24.387	2025-10-27 11:26:24.387	2	42	structure / ruchnoy-instrument / golovki-tortsevye / 1-2-korotkie / 1-2-korotkie-udarnye / 6gr / golovka-19mm-6gr-udarnaya / 660019	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-2-korotkie/d_1-2-korotkie-udarnye/d_6gr/s_golovka-19mm-6gr-udarnaya/p_660019
37	ABG-20	Пистолет продувочный c комплектом сопел ECO ABG-20		87	2025-10-27 11:31:21.48	2025-10-27 11:31:21.48	1	43	structure / pnevmatika / instrument / produvochnye / pistolet-produvochnyy-c-komplektom-sopel / abg-20	structure/d_pnevmatika/d_instrument/d_produvochnye/s_pistolet-produvochnyy-c-komplektom-sopel/p_abg-20
38	YT-38510	Головка свечная 3/8" 14мм L63мм CrV "Yato"		88	2025-10-28 09:21:52.028	2025-10-28 09:21:52.028	7	44	structure / ruchnoy-instrument / golovki-tortsevye / svechnye-golovki / svechnye-14mm / yt-38510	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_svechnye-golovki/s_svechnye-14mm/p_yt-38510
39	ER-53825	Вороток 3/8" DR Г-образный 250мм на держателе ЭВРИКА		91	2025-10-28 09:33:09.481	2025-10-28 09:33:09.481	13	45	structure / ruchnoy-instrument / vorotki-g-obr / 3-8-vorotok-gobraznyy / vorotok-3-8-g-obraznyy / er-53825	structure/d_ruchnoy-instrument/d_vorotki-g-obr/d_3-8-vorotok-gobraznyy/s_vorotok-3-8-g-obraznyy/p_er-53825
40	ST5025	Щетка латунированная STARTUL STANDART (ST5025) (проволочная, пластмассовая рукоятка)		95	2025-10-28 09:40:28.869	2025-10-28 09:40:28.869	6	50	structure / metalloobrabotka / schetki-ruchnye / schetki-ruchnye / st5025	structure/d_metalloobrabotka/d_schetki-ruchnye/s_schetki-ruchnye/p_st5025
41	F-HB140	Щетка ручная по металлу с пластиковой ручкой(L общ-260мм, L раб.-140мм)		95	2025-10-28 09:45:04.161	2025-10-28 09:45:04.161	12	50	structure / metalloobrabotka / schetki-ruchnye / schetki-ruchnye / f-hb140	structure/d_metalloobrabotka/d_schetki-ruchnye/s_schetki-ruchnye/p_f-hb140
42	RF-HB140	Щетка ручная по металлу с пластиковой ручкой(L общ-260мм, L раб.-140мм)		95	2025-10-28 09:46:00.374	2025-10-28 09:46:00.374	8	50	structure / metalloobrabotka / schetki-ruchnye / schetki-ruchnye / rf-hb140	structure/d_metalloobrabotka/d_schetki-ruchnye/s_schetki-ruchnye/p_rf-hb140
43	F-340122113	Щетка по металлу ручная в пластиковом корпусе с прорезиненной рукояткой (металлический скребок-40мм, высокоуглеродистая сталь, 3x19рядов)		95	2025-10-28 09:50:56.913	2025-10-28 09:50:56.913	12	50	structure / metalloobrabotka / schetki-ruchnye / schetki-ruchnye / f-340122113	structure/d_metalloobrabotka/d_schetki-ruchnye/s_schetki-ruchnye/p_f-340122113
44	44016	Щетка металлическая 6-рядная с пластиковой ручкой (АвтоDело) 44016		95	2025-10-28 09:51:33.963	2025-10-28 09:51:33.963	11	50	structure / metalloobrabotka / schetki-ruchnye / schetki-ruchnye / 44016	structure/d_metalloobrabotka/d_schetki-ruchnye/s_schetki-ruchnye/p_44016
45	RF-807421	Головка свечная 21мм 1/2''(6гр.)		88	2025-10-28 10:09:09.117	2025-10-28 10:09:09.117	8	51	structure / ruchnoy-instrument / golovki-tortsevye / svechnye-golovki / svechnye-16mm / rf-807421	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_svechnye-golovki/s_svechnye-16mm/p_rf-807421
47	FSEB1250	Насадка TORX T50 75мм LONG TOPTUL		17	2025-10-28 10:24:04.675	2025-10-28 10:24:04.675	4	52	structure / bity / 10mm / dlinnye / torx-17675 / bita-torks-t50-75mm / fseb1250	structure/d_bity/d_10mm/d_dlinnye/d_torx-17675/s_bita-torks-t50-75mm/p_fseb1250
48	RF-1767545 Premium	Бита TORX T45х75ммL,10мм		17	2025-10-28 10:31:43.468	2025-10-28 10:31:43.468	8	53	structure / bity / 10mm / dlinnye / torx-17675 / bita-torks-t45-75mm / rf-1767545-premium	structure/d_bity/d_10mm/d_dlinnye/d_torx-17675/s_bita-torks-t45-75mm/p_rf-1767545-premium
49	FSEB1245	Насадка TORX T45 75мм LONG TOPTUL		17	2025-10-28 10:32:44.945	2025-10-28 10:32:44.945	4	53	structure / bity / 10mm / dlinnye / torx-17675 / bita-torks-t45-75mm / fseb1245	structure/d_bity/d_10mm/d_dlinnye/d_torx-17675/s_bita-torks-t45-75mm/p_fseb1245
50	1767530	Насадка 10мм. L-75мм. TORX T30 FORCE 1767530		17	2025-10-28 10:42:51.622	2025-10-28 10:42:51.622	3	55	structure / bity / 10mm / dlinnye / torx-17675 / bita-torks-t30-75mm / 1767530	structure/d_bity/d_10mm/d_dlinnye/d_torx-17675/s_bita-torks-t30-75mm/p_1767530
51	GAAV0703	Набор бит TORX с отверст. Т10-Т40 7шт. TOPTUL		96	2025-10-28 10:51:10.791	2025-10-28 10:51:10.791	4	58	structure / bity / nabory-bit-1-4-1-4 / pen-ki / gaav0703	structure/d_bity/d_nabory-bit-1-4-1-4/s_pen-ki/p_gaav0703
52	FSEA1245	Насадка TORX T45 30мм TOPTUL (Присоединительный размер 10мм)		20	2025-10-28 12:03:39.248	2025-10-28 12:03:39.248	4	59	structure / bity / 10mm / korotkie / torx-17630 / bita-torks-t45-30mm / fsea1245	structure/d_bity/d_10mm/d_korotkie/d_torx-17630/s_bita-torks-t45-30mm/p_fsea1245
53	F-75532	Ключ комбинированный 32мм		97	2025-10-28 12:10:26.733	2025-10-28 12:10:26.733	12	62	structure / ruchnoy-instrument / klyuchi / kombinir-poshtuchno / klyuch-32mm / f-75532	structure/d_ruchnoy-instrument/d_klyuchi/d_kombinir-poshtuchno/s_klyuch-32mm/p_f-75532
54	539 230	Монтировка с рукояткой 20×450мм		99	2025-10-28 12:32:09.199	2025-10-28 12:32:09.199	2	63	structure / ruchnoy-instrument / montirovki / montirovki-s-rukoyatkoy / montirovka-s-rukoyatkoy / 539-230	structure/d_ruchnoy-instrument/d_montirovki/d_montirovki-s-rukoyatkoy/s_montirovka-s-rukoyatkoy/p_539-230
55	539 210	Монтировка с рукояткой 11×220мм		99	2025-10-28 12:33:19.856	2025-10-28 12:33:19.856	2	63	structure / ruchnoy-instrument / montirovki / montirovki-s-rukoyatkoy / montirovka-s-rukoyatkoy / 539-210	structure/d_ruchnoy-instrument/d_montirovki/d_montirovki-s-rukoyatkoy/s_montirovka-s-rukoyatkoy/p_539-210
56	539 240	Монтировка с рукояткой 20×590мм		99	2025-10-28 12:33:54.612	2025-10-28 12:33:54.612	2	63	structure / ruchnoy-instrument / montirovki / montirovki-s-rukoyatkoy / montirovka-s-rukoyatkoy / 539-240	structure/d_ruchnoy-instrument/d_montirovki/d_montirovki-s-rukoyatkoy/s_montirovka-s-rukoyatkoy/p_539-240
57	560 008	Ключ четырехгранный 8мм		101	2025-10-28 12:44:09.988	2025-10-28 12:44:09.988	2	65	structure / spetsial-nyy-instrument / zamena-masla / klyuch-kocherga / 8mm-kocherga / 560-008	structure/d_spetsial-nyy-instrument/d_zamena-masla/d_klyuch-kocherga/s_8mm-kocherga/p_560-008
58	560 010	Ключ четырехгранный 10мм		101	2025-10-28 12:45:10.774	2025-10-28 12:45:10.774	2	66	structure / spetsial-nyy-instrument / zamena-masla / klyuch-kocherga / 10mm-kocherga / 560-010	structure/d_spetsial-nyy-instrument/d_zamena-masla/d_klyuch-kocherga/s_10mm-kocherga/p_560-010
59	1783007	ита- сплайн М7 30мм Force 1783007		25	2025-10-29 06:17:57.781	2025-10-29 06:17:57.781	3	69	structure / bity / 10mm / korotkie / spine-17830 / bita-splayn-m07-30mm / 1783007	structure/d_bity/d_10mm/d_korotkie/d_spine-17830/s_bita-splayn-m07-30mm/p_1783007
60	R7300141	Ключ динамометрический 1/4' 5-25 Нм, 72 зуба, в кейсе L=245мм ARNEZI R7300141		104	2025-10-29 07:29:22.418	2025-10-29 07:29:22.418	5	70	structure / ruchnoy-instrument / izmeritel-nyy / dinamometricheskie-klyuchi / 1-4-dinamometricheskiy / r7300141	structure/d_ruchnoy-instrument/d_izmeritel-nyy/d_dinamometricheskie-klyuchi/s_1-4-dinamometricheskiy/p_r7300141
61	R7300121	Ключ динамометрический 1/2 20-210 Нм, 72 зуба, в кейсе L=490мм ARNEZI R7300121		104	2025-10-29 07:33:38.878	2025-10-29 07:33:38.878	5	72	structure / ruchnoy-instrument / izmeritel-nyy / dinamometricheskie-klyuchi / 1-2-dinamometricheskie / r7300121	structure/d_ruchnoy-instrument/d_izmeritel-nyy/d_dinamometricheskie-klyuchi/s_1-2-dinamometricheskie/p_r7300121
62	R7300382	Ключ динамометрический 3/8 10-110 Нм, 72 зуба, в кейсе L=470мм ARNEZI R7300382		104	2025-10-29 07:34:41.817	2025-10-29 07:34:41.817	5	71	structure / ruchnoy-instrument / izmeritel-nyy / dinamometricheskie-klyuchi / 3-8-dinamometricheskie / r7300382	structure/d_ruchnoy-instrument/d_izmeritel-nyy/d_dinamometricheskie-klyuchi/s_3-8-dinamometricheskie/p_r7300382
63	HZ 27.1.047W	Вороток моментный с трещоточным механизмом 5-25 Hм 1/4" Хорекс Авто HZ 27.1.047W		104	2025-10-29 07:45:12.166	2025-10-29 07:45:12.166	14	70	structure / ruchnoy-instrument / izmeritel-nyy / dinamometricheskie-klyuchi / 1-4-dinamometricheskiy / hz-27-1-047w	structure/d_ruchnoy-instrument/d_izmeritel-nyy/d_dinamometricheskie-klyuchi/s_1-4-dinamometricheskiy/p_hz-27-1-047w
64	CHAG0813	Трещотка 1/4" 36зуб. 131мм TOPTUL		108	2025-10-29 08:16:02.669	2025-10-29 08:16:02.669	4	73	structure / ruchnye-treschotki / treschotki-ruchnye-1-4 / treschotka-metallicheskaya-1-4 / chag0813	structure/d_ruchnye-treschotki/d_treschotki-ruchnye-1-4/s_treschotka-metallicheskaya-1-4/p_chag0813
65	BM-802222	Ключ трещоточный 1/4''(72зуб)		71	2025-10-29 08:23:59.396	2025-10-29 08:23:59.396	15	37	structure / ruchnoy-instrument / treschotki / 1-4-treschotki / 1-4-treschotka-80222 / bm-802222	structure/d_ruchnoy-instrument/d_treschotki/d_1-4-treschotki/s_1-4-treschotka-80222/p_bm-802222
66	CJBG0815	Трещотка 1/4" 36зуб. 150мм TOPTUL		108	2025-10-29 08:26:52.636	2025-10-29 08:26:52.636	4	74	structure / ruchnye-treschotki / treschotki-ruchnye-1-4 / treschotka-obrezinennaya-1-4 / cjbg0815	structure/d_ruchnye-treschotki/d_treschotki-ruchnye-1-4/s_treschotka-obrezinennaya-1-4/p_cjbg0815
67	80222	Трещотка 1/4'' 24 зуб. 155 мм Force 80222		108	2025-10-29 08:29:39.651	2025-10-29 08:29:39.651	3	74	structure / ruchnye-treschotki / treschotki-ruchnye-1-4 / treschotka-obrezinennaya-1-4 / 80222	structure/d_ruchnye-treschotki/d_treschotki-ruchnye-1-4/s_treschotka-obrezinennaya-1-4/p_80222
91	608815	Рукоятка 150 мм 1/4		122	2025-10-30 08:13:24.038	2025-10-30 08:13:24.038	2	116	structure / ruchnoy-instrument / bitoderzhateli-rukoyatki / rukoyatka-dlya-golovok-1-4 / 608815	structure/d_ruchnoy-instrument/d_bitoderzhateli-rukoyatki/s_rukoyatka-dlya-golovok-1-4/p_608815
68	Sch-TAP14x1.5	Метчик M14x1,5 (3шт)		113	2025-10-29 08:34:47.419	2025-10-29 08:34:47.419	16	75	structure / metalloobrabotka / metchiki-plashki-vorotki / metchiki-poshtuchno / metchik-14mm / sch-tap14x1-5	structure/d_metalloobrabotka/d_metchiki-plashki-vorotki/d_metchiki-poshtuchno/s_metchik-14mm/p_sch-tap14x1-5
69	ER13130	Клещи переставные ER-13130 универсальные, покрытие черное порошковое 300мм ЭВРИКА 1/36		117	2025-10-29 08:39:32.204	2025-10-29 08:39:32.204	13	76	structure / ruchnoy-instrument / sharnirno-gubtsevyy / kleschi-perestavnye / perestavnye-300mm / er13130	structure/d_ruchnoy-instrument/d_sharnirno-gubtsevyy/d_kleschi-perestavnye/s_perestavnye-300mm/p_er13130
70	270055	Щётка-мини с прорезиненной рукояткой, щетина из нержавеющей стали		95	2025-10-29 08:43:50.007	2025-10-29 08:43:50.007	2	50	structure / metalloobrabotka / schetki-ruchnye / schetki-ruchnye / 270055	structure/d_metalloobrabotka/d_schetki-ruchnye/s_schetki-ruchnye/p_270055
71	1767545	Бита Force 1767545 T45		17	2025-10-29 08:47:34.463	2025-10-29 08:47:34.463	3	53	structure / bity / 10mm / dlinnye / torx-17675 / bita-torks-t45-75mm / 1767545	structure/d_bity/d_10mm/d_dlinnye/d_torx-17675/s_bita-torks-t45-75mm/p_1767545
72	39775	Вороток Г-образн. (3/8"; 200*75 mm) АвтоDело		91	2025-10-29 08:54:48.127	2025-10-29 08:54:48.127	11	45	structure / ruchnoy-instrument / vorotki-g-obr / 3-8-vorotok-gobraznyy / vorotok-3-8-g-obraznyy / 39775	structure/d_ruchnoy-instrument/d_vorotki-g-obr/d_3-8-vorotok-gobraznyy/s_vorotok-3-8-g-obraznyy/p_39775
73	SB31020	Щетка для чистки каналов		95	2025-10-29 08:57:59.799	2025-10-29 08:57:59.799	17	79	structure / metalloobrabotka / schetki-ruchnye / schetki-dlya-napravlyayuschih-stab / sb31020	structure/d_metalloobrabotka/d_schetki-ruchnye/s_schetki-dlya-napravlyayuschih-stab/p_sb31020
74	RF-9T0801	Съемник рулевых тяг универсальный 27-42мм, 1/2''		118	2025-10-29 09:03:03.839	2025-10-29 09:03:03.839	8	80	structure / spetsial-nyy-instrument / hodovaya-chast / tyagi / s-emnik-rulevyh-tyag-universal-nyy-27-42mm / rf-9t0801	structure/d_spetsial-nyy-instrument/d_hodovaya-chast/d_tyagi/s_s-emnik-rulevyh-tyag-universal-nyy-27-42mm/p_rf-9t0801
75	608 745	Трещотка 45 зубцов 1/4"		108	2025-10-29 09:09:32.541	2025-10-29 09:09:32.541	2	74	structure / ruchnye-treschotki / treschotki-ruchnye-1-4 / treschotka-obrezinennaya-1-4 / 608-745	structure/d_ruchnye-treschotki/d_treschotki-ruchnye-1-4/s_treschotka-obrezinennaya-1-4/p_608-745
76	Sch-TAP12x1.75	Метчик M12x1,75 (3шт)		113	2025-10-29 09:17:20.017	2025-10-29 09:17:20.017	16	81	structure / metalloobrabotka / metchiki-plashki-vorotki / metchiki-poshtuchno / metchik-12mm / sch-tap12x1-75	structure/d_metalloobrabotka/d_metchiki-plashki-vorotki/d_metchiki-poshtuchno/s_metchik-12mm/p_sch-tap12x1-75
77	RF-TAP10x1,25	Метчик M10x1,25 (3шт)		113	2025-10-29 09:21:53.078	2025-10-29 09:21:53.078	12	82	structure / metalloobrabotka / metchiki-plashki-vorotki / metchiki-poshtuchno / metchik-10mm / rf-tap10x1-25	structure/d_metalloobrabotka/d_metchiki-plashki-vorotki/d_metchiki-poshtuchno/s_metchik-10mm/p_rf-tap10x1-25
78	Sch-TAP10x1,5	Метчик M10x1,5 (3шт)		113	2025-10-29 09:23:00.079	2025-10-29 09:23:00.079	16	82	structure / metalloobrabotka / metchiki-plashki-vorotki / metchiki-poshtuchno / metchik-10mm / sch-tap10x1-5	structure/d_metalloobrabotka/d_metchiki-plashki-vorotki/d_metchiki-poshtuchno/s_metchik-10mm/p_sch-tap10x1-5
79	ER01010M	Метчик ER-01010M M10x1 (2шт),в пластиковом футляре ЭВРИКА /1		113	2025-10-29 09:25:10.398	2025-10-29 09:25:10.398	13	82	structure / metalloobrabotka / metchiki-plashki-vorotki / metchiki-poshtuchno / metchik-10mm / er01010m	structure/d_metalloobrabotka/d_metchiki-plashki-vorotki/d_metchiki-poshtuchno/s_metchik-10mm/p_er01010m
80	Sch-TAP9x1	Метчик M9x1 (3шт)		113	2025-10-29 09:29:05.199	2025-10-29 09:29:05.199	16	83	structure / metalloobrabotka / metchiki-plashki-vorotki / metchiki-poshtuchno / metchik-9mm / sch-tap9x1	structure/d_metalloobrabotka/d_metchiki-plashki-vorotki/d_metchiki-poshtuchno/s_metchik-9mm/p_sch-tap9x1
81	Sch-TAP8x1,25	Метчик M8x1,25 (3шт)		113	2025-10-29 09:31:07.459	2025-10-29 09:31:07.459	16	84	structure / metalloobrabotka / metchiki-plashki-vorotki / metchiki-poshtuchno / metchik-8mm / sch-tap8x1-25	structure/d_metalloobrabotka/d_metchiki-plashki-vorotki/d_metchiki-poshtuchno/s_metchik-8mm/p_sch-tap8x1-25
82	Sch-TAP8x1	Метчик M8x1 (3шт)		113	2025-10-29 09:32:46.588	2025-10-29 09:32:46.588	16	84	structure / metalloobrabotka / metchiki-plashki-vorotki / metchiki-poshtuchno / metchik-8mm / sch-tap8x1	structure/d_metalloobrabotka/d_metchiki-plashki-vorotki/d_metchiki-poshtuchno/s_metchik-8mm/p_sch-tap8x1
83	FK-46510027	Головка ударная глубокая 27мм (6гр.), 3/4''		41	2025-10-29 09:56:00.329	2025-10-29 09:56:00.329	10	85	structure / ruchnoy-instrument / golovki-tortsevye / 3-4-dlinnye / golovka-27mm-3-4-dlinnaya / fk-46510027	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_3-4-dlinnye/s_golovka-27mm-3-4-dlinnaya/p_fk-46510027
85	HZ 25.1.281W	Съемник клемм АКБ и поводков стеклоочистителя Хорекс Авто		121	2025-10-29 10:43:41.112	2025-10-29 10:43:41.112	14	87	structure / spetsial-nyy-instrument / s-emniki / s-emnik-dvornikov / s-emnik-klemm-akb-i-povodkov-stekloochistitelya / hz-25-1-281w	structure/d_spetsial-nyy-instrument/d_s-emniki/d_s-emnik-dvornikov/s_s-emnik-klemm-akb-i-povodkov-stekloochistitelya/p_hz-25-1-281w
86	628 745	Трещотка 45 зубцов 1/2"		110	2025-10-29 10:50:01.319	2025-10-29 10:50:01.319	2	88	structure / ruchnye-treschotki / treschotki-ruchnye-1-2 / treschotka-1-2-s-rezinovoy-ruchkoy / 628-745	structure/d_ruchnye-treschotki/d_treschotki-ruchnye-1-2/s_treschotka-1-2-s-rezinovoy-ruchkoy/p_628-745
87	R7300381	ключ динамометрический! 3/8 5-25нм, 72 зуба, в кейсе\\ R7300381 ARNEZI		104	2025-10-30 07:46:51.723	2025-10-30 07:46:51.723	5	71	structure / ruchnoy-instrument / izmeritel-nyy / dinamometricheskie-klyuchi / 3-8-dinamometricheskie / r7300381	structure/d_ruchnoy-instrument/d_izmeritel-nyy/d_dinamometricheskie-klyuchi/s_3-8-dinamometricheskie/p_r7300381
88	JCB-75510	Ключ комбинированный 10мм		97	2025-10-30 07:54:16.624	2025-10-30 07:54:16.624	9	89	structure / ruchnoy-instrument / klyuchi / kombinir-poshtuchno / klyuch-10mm / jcb-75510	structure/d_ruchnoy-instrument/d_klyuchi/d_kombinir-poshtuchno/s_klyuch-10mm/p_jcb-75510
90	RF-8143	Рукоятка для головок 1/4''(6''-150мм)		122	2025-10-30 08:12:18.277	2025-10-30 08:12:18.277	8	116	structure / ruchnoy-instrument / bitoderzhateli-rukoyatki / rukoyatka-dlya-golovok-1-4 / rf-8143	structure/d_ruchnoy-instrument/d_bitoderzhateli-rukoyatki/s_rukoyatka-dlya-golovok-1-4/p_rf-8143
89	JCB-75508	Ключ комбинированный 8мм		97	2025-10-30 07:58:27.609	2025-10-30 07:58:27.609	9	90	structure / ruchnoy-instrument / klyuchi / kombinir-poshtuchno / klyuch-8mm / jcb-75508	structure/d_ruchnoy-instrument/d_klyuchi/d_kombinir-poshtuchno/s_klyuch-8mm/p_jcb-75508
92	600 057	Головка шестигранная 7 мм 1/4"		36	2025-10-30 08:33:46.949	2025-10-30 08:33:46.949	2	117	structure / ruchnoy-instrument / golovki-tortsevye / 1-4-korotkie / golovka-7mm / 600-057	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-4-korotkie/s_golovka-7mm/p_600-057
93	BAEA0807	Головка 1/4" 7мм 6гр.TOPTUL		36	2025-10-30 08:37:48.786	2025-10-30 08:37:48.786	4	117	structure / ruchnoy-instrument / golovki-tortsevye / 1-4-korotkie / golovka-7mm / baea0807	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-4-korotkie/s_golovka-7mm/p_baea0807
94	KAJA18C1	Зубило для пневмомолотка по листовому металлу 178мм TOPTUL		124	2025-10-30 09:42:22.593	2025-10-30 09:42:22.593	4	118	structure / pnevmatika / instrument / otboynye-molotki / zubila / zubila-dlya-molotkov / kaja18c1	structure/d_pnevmatika/d_instrument/d_otboynye-molotki/d_zubila/s_zubila-dlya-molotkov/p_kaja18c1
95	80942	Адаптер для головок 1/2''(F)х1/4''(M) L36 мм Force		127	2025-10-30 09:52:32.706	2025-10-30 09:52:32.706	3	119	structure / ruchnoy-instrument / adaptery-perehodniki / perehodnik-1-2 / adapter-perehodnik-1-2-na-1-7 / 80942	structure/d_ruchnoy-instrument/d_adaptery-perehodniki/d_perehodnik-1-2/s_adapter-perehodnik-1-2-na-1-7/p_80942
96	603 008	Головка TORX E8 1/4"		130	2025-10-30 09:59:29.138	2025-10-30 09:59:29.138	2	120	structure / ruchnoy-instrument / golovki-tortsevye / golovki-e-profil / e-1-4-poshtuchno / golovki-torx-1-4-e8 / 603-008	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_golovki-e-profil/d_e-1-4-poshtuchno/s_golovki-torx-1-4-e8/p_603-008
97	839 816	Гайколом 12-16мм		133	2025-10-30 10:07:43.9	2025-10-30 10:07:43.9	2	121	structure / spetsial-nyy-instrument / gaykolomy-gaykokoly / gaykolomy-delo-tehnka / 839-816	structure/d_spetsial-nyy-instrument/d_gaykolomy-gaykokoly/s_gaykolomy-delo-tehnka/p_839-816
98	839 822	Гайколом 16-22мм		133	2025-10-30 10:08:28.886	2025-10-30 10:08:28.886	2	121	structure / spetsial-nyy-instrument / gaykolomy-gaykokoly / gaykolomy-delo-tehnka / 839-822	structure/d_spetsial-nyy-instrument/d_gaykolomy-gaykokoly/s_gaykolomy-delo-tehnka/p_839-822
99	40574	Приспособление для притирки клапанов механическое (для электрической дрели), 6 предметов ("АвтоDело") (40574)		135	2025-11-02 10:32:17.146	2025-11-02 10:32:17.146	11	122	structure / spetsial-nyy-instrument / dvigatel / gbts / pritirka-klapanov / pritirka-klapanov-na-drel / 40574	structure/d_spetsial-nyy-instrument/d_dvigatel/d_gbts/d_pritirka-klapanov/s_pritirka-klapanov-na-drel/p_40574
100	JCB-76413	Ключ Г-образный 6-гранный 13мм		136	2025-11-02 10:40:46.961	2025-11-02 10:40:46.961	9	123	structure / ruchnoy-instrument / g-obraznye-klyuchi-hex-torx / klyuch-g-obraznyy-6-grannyy-13mm / jcb-76413	structure/d_ruchnoy-instrument/d_g-obraznye-klyuchi-hex-torx/s_klyuch-g-obraznyy-6-grannyy-13mm/p_jcb-76413
101	JCB-76416	Ключ Г-образный 6-гранный 16мм		136	2025-11-02 10:44:06.928	2025-11-02 10:44:06.928	9	126	structure / ruchnoy-instrument / g-obraznye-klyuchi-hex-torx / klyuch-g-obraznyy-6-grannyy-16mm / jcb-76416	structure/d_ruchnoy-instrument/d_g-obraznye-klyuchi-hex-torx/s_klyuch-g-obraznyy-6-grannyy-16mm/p_jcb-76416
102	JCB-76418	Ключ Г-образный 6-гранный 18мм		136	2025-11-02 10:46:45.265	2025-11-02 10:46:45.265	9	128	structure / ruchnoy-instrument / g-obraznye-klyuchi-hex-torx / klyuch-g-obraznyy-6-grannyy-18mm / jcb-76418	structure/d_ruchnoy-instrument/d_g-obraznye-klyuchi-hex-torx/s_klyuch-g-obraznyy-6-grannyy-18mm/p_jcb-76418
103	JCB-76419	Ключ Г-образный 6-гранный 19мм		136	2025-11-02 10:47:48.805	2025-11-02 10:47:48.805	9	129	structure / ruchnoy-instrument / g-obraznye-klyuchi-hex-torx / klyuch-g-obraznyy-6-grannyy-19mm / jcb-76419	structure/d_ruchnoy-instrument/d_g-obraznye-klyuchi-hex-torx/s_klyuch-g-obraznyy-6-grannyy-19mm/p_jcb-76419
104	JCB-76417	Ключ Г-образный 6-гранный 17мм		136	2025-11-02 10:49:02.467	2025-11-02 10:49:02.467	9	127	structure / ruchnoy-instrument / g-obraznye-klyuchi-hex-torx / klyuch-g-obraznyy-6-grannyy-17mm / jcb-76417	structure/d_ruchnoy-instrument/d_g-obraznye-klyuchi-hex-torx/s_klyuch-g-obraznyy-6-grannyy-17mm/p_jcb-76417
105	RF-60316175	Зубило с шестигранным основанием 16мм (L-175мм),на пластиковом держателе		137	2025-11-02 10:55:36.257	2025-11-02 10:55:36.257	8	130	structure / metalloobrabotka / zubilo / zubilo-ruchnye-16mm / rf-60316175	structure/d_metalloobrabotka/d_zubilo/s_zubilo-ruchnye-16mm/p_rf-60316175
106	669 450	Переходник ударный 3/4"F × 1/2"M		138	2025-11-02 11:01:11.851	2025-11-02 11:01:11.851	2	131	structure / ruchnoy-instrument / adaptery-perehodniki / udarnye-adaptery / 3-4-1-2-udarnyy-perehodnik / 669-450	structure/d_ruchnoy-instrument/d_adaptery-perehodniki/d_udarnye-adaptery/s_3-4-1-2-udarnyy-perehodnik/p_669-450
107	F-8156450MPB	Вороток Г-образный двухсторонний ударный CR-Mo 450мм 3/4''		93	2025-11-02 11:16:16.681	2025-11-02 11:16:16.681	12	46	structure / ruchnoy-instrument / vorotki-g-obr / 3-4-vorotok-gobraznyy / vorotok-3-4-g-obraznyy / f-8156450mpb	structure/d_ruchnoy-instrument/d_vorotki-g-obr/d_3-4-vorotok-gobraznyy/s_vorotok-3-4-g-obraznyy/p_f-8156450mpb
108	F-T43001C ST	Подставка ремонтная 3т (h min 285мм, h max 420мм) (к-т 2шт.)		140	2025-11-02 11:23:25.118	2025-11-02 11:23:25.118	12	132	structure / pod-emnoe / podstavki-2-3t / podstavka-3t-h-285mm-h-420mm-k-t-2sht / f-t43001c-st	structure/d_pod-emnoe/d_podstavki-2-3t/s_podstavka-3t-h-285mm-h-420mm-k-t-2sht/p_f-t43001c-st
109	CAEA1612	Переходник 1/2"(F)х3/8(М) TOPTUL		127	2025-11-02 11:31:48.156	2025-11-02 11:31:48.156	4	133	structure / ruchnoy-instrument / adaptery-perehodniki / perehodnik-1-2 / adapter-1-2-na-3-8 / caea1612	structure/d_ruchnoy-instrument/d_adaptery-perehodniki/d_perehodnik-1-2/s_adapter-1-2-na-3-8/p_caea1612
110	BCFA1660	Головка 1/2" с насадкой TORX T60 TOPTUL		13	2025-11-02 11:36:03.04	2025-11-02 11:36:03.04	4	134	structure / bity / 1-2-zapressovannye / torx-t60 / bcfa1660	structure/d_bity/d_1-2-zapressovannye/s_torx-t60/p_bcfa1660
111	R7703502	Клещи для самозажимных хомутов MUBEA ARNEZI		144	2025-11-02 11:53:35.432	2025-11-02 11:53:35.432	5	135	structure / sharnirno-gubtsevyy-instrument / samozazhimnyh-homutov / mubea-schiptsy-samozazhimnyh-homutov / r7703502	structure/d_sharnirno-gubtsevyy-instrument/d_samozazhimnyh-homutov/s_mubea-schiptsy-samozazhimnyh-homutov/p_r7703502
112	PRO-6065	Шприц автомобильный для смазки 400мл PRO STARTUL (PRO-6065) (рычажно-плунжерный, с гибким шлангом и стальной трубкой)		146	2025-11-03 08:59:35.868	2025-11-03 08:59:35.868	6	136	structure / oborudovanie / shpritsy / shpritsy-litol / shprits-dlya-litola-400mm / pro-6065	structure/d_oborudovanie/d_shpritsy/d_shpritsy-litol/s_shprits-dlya-litola-400mm/p_pro-6065
113	766906	Отвёртка ударная со вставками 5/16"		149	2025-11-03 09:05:28.519	2025-11-03 09:05:28.519	2	139	structure / ruchnoy-instrument / otvertki / udarno-povorotnye-otvertki / udarno-povorotnaya-otvertka-s-6-bitami / 766906	structure/d_ruchnoy-instrument/d_otvertki/d_udarno-povorotnye-otvertki/s_udarno-povorotnaya-otvertka-s-6-bitami/p_766906
114	RF-8014750U	Вороток шарнирный 750мм 1/2''		156	2025-11-03 09:13:02.847	2025-11-03 09:13:02.847	8	140	structure / ruchnoy-instrument / vorotki-sharnirnye / sharnirnyy-1-2 / voprotok-u-750mm / rf-8014750u	structure/d_ruchnoy-instrument/d_vorotki-sharnirnye/d_sharnirnyy-1-2/s_voprotok-u-750mm/p_rf-8014750u
115	RF-44519	Головка ударная 19мм (6гр.), 1/2''		85	2025-11-03 09:16:53.249	2025-11-03 09:16:53.249	8	42	structure / ruchnoy-instrument / golovki-tortsevye / 1-2-korotkie / 1-2-korotkie-udarnye / 6gr / golovka-19mm-6gr-udarnaya / rf-44519	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-2-korotkie/d_1-2-korotkie-udarnye/d_6gr/s_golovka-19mm-6gr-udarnaya/p_rf-44519
116	FK-56946	Головка 46мм (12гр.), 3/4''		40	2025-11-03 09:19:58.015	2025-11-03 09:19:58.015	10	142	structure / ruchnoy-instrument / golovki-tortsevye / 3-4-korotkie / golovka-46mm-12gr / fk-56946	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_3-4-korotkie/s_golovka-46mm-12gr/p_fk-56946
117	PA-68-175HS	Съемник стопорных колец прямой на сжатие (L-175мм), в блистере		159	2025-11-03 09:25:35.186	2025-11-03 09:25:35.186	18	145	structure / ruchnoy-instrument / stopornye-kol-tsa / poshtuchno-175mm / szhim-gnutye-175 / pa-68-175hs	structure/d_ruchnoy-instrument/d_stopornye-kol-tsa/d_poshtuchno-175mm/s_szhim-gnutye-175/p_pa-68-175hs
\.


--
-- Data for Name: reorder_points; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reorder_points (id, "productUnitId", "minStock", "maxStock", "reorderQty", "leadTime", "safetyStock", "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: spines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.spines (id, name, slug, "categoryId", "imagePath", "createdAt", "updatedAt", "brandData", human_path, node_index) FROM stdin;
1	Пистолет под гравитекса	pistolet-pod-graviteksa	3	\N	2025-10-24 12:28:49.014	2025-10-24 12:30:32.163	{"Eco":{"displayName":"Пистолет для антикоррозионных покрытий SG-35C14 ECO со шлангом","imagePath":"/media/products/1/SG-35C14.webp","productCode":"SG-35C14","updatedAt":"2025-10-24T12:30:32.162Z"}}	structure / pnevmatika / instrument / pistolet-dlya-graviteksa / pistolet-pod-graviteksa	structure/d_pnevmatika/d_instrument/d_pistolet-dlya-graviteksa/s_pistolet-pod-graviteksa
2	Головка 21мм (12гр.)	golovka-21mm-12gr	7	\N	2025-10-24 12:34:04.032	2025-10-24 12:39:09.746	{"Дело техники":{"displayName":"Головка двенадцатигранная 21 мм 1/2\\"","imagePath":"/media/products/2/622021.webp","productCode":"622021","updatedAt":"2025-10-24T12:39:09.745Z"}}	structure / ruchnoy-instrument / golovki-tortsevye / 1-2-korotkie / 12-graney / golovka-21mm-12gr	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-2-korotkie/d_12-graney/s_golovka-21mm-12gr
4	Переходник 3/8"(F)х1/4(М)	perehodnik-3-8-f-h1-4-m	19	\N	2025-10-25 06:53:07.224	2025-10-25 06:54:19.424	{"Без бренда":{"displayName":"Переходник 3/8\\"(F)х1/4(М) TOPTUL","imagePath":"/media/products/4/CAEA1208.webp","productCode":"CAEA1208","updatedAt":"2025-10-25T06:54:19.422Z"}}	structure / ruchnoy-instrument / adaptery-perehodniki / perehodnik-3-8 / perehodnik-3-8-f-h1-4-m	structure/d_ruchnoy-instrument/d_adaptery-perehodniki/d_perehodnik-3-8/s_perehodnik-3-8-f-h1-4-m
3	Бита TORX T40х75мм	bita-torx-t40h75mm	17	\N	2025-10-25 06:38:01.053	2025-10-25 07:04:25.06	{"Force":{"displayName":"Бита Torx T40 10 мм. FORCE 1767540","imagePath":"/media/products/3/1767540.webp","productCode":"1767540","updatedAt":"2025-10-25T06:45:36.390Z"},"TOPTUL":{"displayName":"Насадка TORX T40 75мм LONG TOPTUL","imagePath":"/media/products/5/FSEB1240.webp","productCode":"FSEB1240","updatedAt":"2025-10-25T07:04:25.058Z"}}	structure / bity / 10mm / dlinnye / torx-17675 / bita-torx-t40h75mm	structure/d_bity/d_10mm/d_dlinnye/d_torx-17675/s_bita-torx-t40h75mm
5	Бита Torx T40 10 мм	bita-torx-t40-10-mm	20	\N	2025-10-25 07:10:06.093	2025-10-25 07:11:17.437	{"Force":{"displayName":"Бита Torx T40 10 мм. FORCE 1763040","imagePath":"/media/products/6/1763040.webp","productCode":"1763040","updatedAt":"2025-10-25T07:11:17.436Z"}}	structure / bity / 10mm / korotkie / torx-17630 / bita-torx-t40-10-mm	structure/d_bity/d_10mm/d_korotkie/d_torx-17630/s_bita-torx-t40-10-mm
6	Поддон для слива масла 8 л	poddon-dlya-sliva-masla-8-l	29	\N	2025-10-25 07:31:45.446	2025-10-25 07:33:08.455	{"ARNEZI":{"displayName":"ARNEZI R7401001 Поддон для слива масла 8 л.","imagePath":null,"productCode":"R7401001","updatedAt":"2025-10-25T07:33:08.454Z"}}	structure / oborudovanie / dlya-zameny-teh-zhidkostey-smazka / sliv-otkachka-masla / taziki / poddon-dlya-sliva-masla-8-l	structure/d_oborudovanie/d_dlya-zameny-teh-zhidkostey-smazka/d_sliv-otkachka-masla/d_taziki/s_poddon-dlya-sliva-masla-8-l
7	Заклепочник поворотный	zaklepochnik-povorotnyy	32	\N	2025-10-25 07:41:44.412	2025-10-25 07:42:47.055	{"STARTUL":{"displayName":"Заклепочник поворотный усиленный 2,4-4,8мм STARTUL PROFI (ST4581)","imagePath":"/media/products/8/ST4581.webp","productCode":"ST4581","updatedAt":"2025-10-25T07:42:47.054Z"}}	structure / ruchnoy-instrument / obschestroitel-nyy-instrument / zaklepochniki / vytyazhnoy / zaklepochnik-povorotnyy	structure/d_ruchnoy-instrument/d_obschestroitel-nyy-instrument/d_zaklepochniki/d_vytyazhnoy/s_zaklepochnik-povorotnyy
8	Головка двенадцатигранная 17мм 1/2"	golovka-dvenadtsatigrannaya-17mm-1-2	7	\N	2025-10-25 07:51:12.079	2025-10-25 08:02:21.081	{"Дело техники":{"displayName":"Головка двенадцатигранная 17мм 1/2\\"","imagePath":"/media/products/9/622017.webp","productCode":"622017","updatedAt":"2025-10-25T07:52:55.411Z"},"TOPTUL":{"displayName":"Головка 1/2\\" 17мм 12гр.TOPTUL","imagePath":null,"productCode":"BAEB1617","updatedAt":"2025-10-25T07:56:28.480Z"},"Force":{"displayName":"Головка 17 мм 12-гранная 1/2DR короткая FORCE 54917","imagePath":"/media/products/11/54917.webp","productCode":"54917","updatedAt":"2025-10-25T08:02:21.079Z"}}	structure / ruchnoy-instrument / golovki-tortsevye / 1-2-korotkie / 12-graney / golovka-dvenadtsatigrannaya-17mm-1-2	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-2-korotkie/d_12-graney/s_golovka-dvenadtsatigrannaya-17mm-1-2
26	головка 10мм 1/4	golovka-10mm-1-4	36	\N	2025-10-25 10:31:19.774	2025-10-25 10:33:43.387	{"JCB":{"displayName":"Головка 10мм (6гр.), 1/4''","imagePath":"/media/products/25/jcb52510.webp","productCode":"jcb52510","updatedAt":"2025-10-25T10:33:43.385Z"}}	structure / ruchnoy-instrument / golovki-tortsevye / 1-4-korotkie / golovka-10mm-1-4	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-4-korotkie/s_golovka-10mm-1-4
9	Набор экстракторов 5-6пр	nabor-ekstraktorov-5-6pr	47	\N	2025-10-25 08:07:07.391	2025-10-25 08:10:12.579	{"Force":{"displayName":"Набор экстракторов 5пр. FORCE 63005B","imagePath":"/media/products/12/63005B.webp","productCode":"63005B","updatedAt":"2025-10-25T08:07:51.644Z"},"Yato":{"displayName":"Набор экстракторов для извлечения обломанных болтов 6пр","imagePath":"/media/products/13/YT0590.webp","productCode":"YT0590","updatedAt":"2025-10-25T08:10:12.578Z"}}	structure / metalloobrabotka / ekstraktory / ekstraktory-shpil-ki / nabor-ekstraktorov-5-6pr	structure/d_metalloobrabotka/d_ekstraktory/d_ekstraktory-shpil-ki/s_nabor-ekstraktorov-5-6pr
28	Съёмник масляных фильтров ременной Ø60-140 мм	s-yomnik-maslyanyh-fil-trov-remennoy-60-140-mm	61	\N	2025-10-25 10:36:44.075	2025-10-25 10:37:32.055	{"Дело техники":{"displayName":"Съёмник масляных фильтров ременной Ø60-140 мм","imagePath":"/media/products/26/800 410.webp","productCode":"800 410","updatedAt":"2025-10-25T10:37:32.054Z"}}	structure / spetsial-nyy-instrument / zamena-masla / universal-nye-s-emniki-maslyanyh-fil-trov / remennoy / s-yomnik-maslyanyh-fil-trov-remennoy-60-140-mm	structure/d_spetsial-nyy-instrument/d_zamena-masla/d_universal-nye-s-emniki-maslyanyh-fil-trov/d_remennoy/s_s-yomnik-maslyanyh-fil-trov-remennoy-60-140-mm
30	Болт к набору для замены сайлентблоков М10	bolt-k-naboru-dlya-zameny-saylentblokov-m10	65	\N	2025-10-25 10:46:00.81	2025-10-25 10:46:00.81	\N	structure / spetsial-nyy-instrument / hodovaya-chast / saylentbloki / shpil-ki / bolt-k-naboru-dlya-zameny-saylentblokov-m10	structure/d_spetsial-nyy-instrument/d_hodovaya-chast/d_saylentbloki/d_shpil-ki/s_bolt-k-naboru-dlya-zameny-saylentblokov-m10
31	Болт к набору для замены сайлентблоков М14	bolt-k-naboru-dlya-zameny-saylentblokov-m14	65	\N	2025-10-25 10:46:06.34	2025-10-25 10:46:06.34	\N	structure / spetsial-nyy-instrument / hodovaya-chast / saylentbloki / shpil-ki / bolt-k-naboru-dlya-zameny-saylentblokov-m14	structure/d_spetsial-nyy-instrument/d_hodovaya-chast/d_saylentbloki/d_shpil-ki/s_bolt-k-naboru-dlya-zameny-saylentblokov-m14
10	Головка шестигранная 17мм 1/2"	golovka-shestigrannaya-17mm-1-2	9	\N	2025-10-25 08:15:18.063	2025-10-25 08:25:34.425	{"Дело техники":{"displayName":"Головка шестигранная 17мм 1/2\\"","imagePath":"/media/products/14/620 017.webp","productCode":"620 017","updatedAt":"2025-10-25T08:16:10.825Z"},"Force":{"displayName":"Головка 17 мм 6-гранная 1/2DR короткая FORCE 54517","imagePath":"/media/products/15/54517.webp","productCode":"54517","updatedAt":"2025-10-25T08:20:01.258Z"},"TOPTUL":{"displayName":"Головка 1/2\\" 17мм 6гр.TOPTUL","imagePath":"/media/products/16/BAEA1617.webp","productCode":"BAEA1617","updatedAt":"2025-10-25T08:25:34.424Z"}}	structure / ruchnoy-instrument / golovki-tortsevye / 1-2-korotkie / 6-graney / golovka-shestigrannaya-17mm-1-2	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-2-korotkie/d_6-graney/s_golovka-shestigrannaya-17mm-1-2
12	головка 8мм 12гр 1/4	golovka-8mm-12gr-1-4	36	\N	2025-10-25 08:39:25.589	2025-10-25 08:39:25.589	\N	structure / ruchnoy-instrument / golovki-tortsevye / 1-4-korotkie / golovka-8mm-12gr-1-4	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-4-korotkie/s_golovka-8mm-12gr-1-4
13	длинная головка 8мм 6гр 1/4	dlinnaya-golovka-8mm-6gr-1-4	37	\N	2025-10-25 08:39:53.026	2025-10-25 08:39:53.026	\N	structure / ruchnoy-instrument / golovki-tortsevye / 1-4-dlinnye / dlinnaya-golovka-8mm-6gr-1-4	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-4-dlinnye/s_dlinnaya-golovka-8mm-6gr-1-4
14	длинная головка 8мм 12гр 1/4	dlinnaya-golovka-8mm-12gr-1-4	37	\N	2025-10-25 08:40:10.931	2025-10-25 08:40:10.931	\N	structure / ruchnoy-instrument / golovki-tortsevye / 1-4-dlinnye / dlinnaya-golovka-8mm-12gr-1-4	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-4-dlinnye/s_dlinnaya-golovka-8mm-12gr-1-4
16	5,5 шлицевая	5-5-shlitsevaya	48	\N	2025-10-25 08:44:03.688	2025-10-25 08:44:03.688	\N	structure / bity / iz-naborov / 1-4-zapressovannye / 5-5-shlitsevaya	structure/d_bity/d_iz-naborov/d_1-4-zapressovannye/s_5-5-shlitsevaya
17	4 шлицевая	4-shlitsevaya	48	\N	2025-10-25 08:44:10.055	2025-10-25 08:44:10.055	\N	structure / bity / iz-naborov / 1-4-zapressovannye / 4-shlitsevaya	structure/d_bity/d_iz-naborov/d_1-4-zapressovannye/s_4-shlitsevaya
19	PH.1 запресованные	ph-1-zapresovannye	48	\N	2025-10-25 08:45:42.345	2025-10-25 08:45:42.345	\N	structure / bity / iz-naborov / 1-4-zapressovannye / ph-1-zapresovannye	structure/d_bity/d_iz-naborov/d_1-4-zapressovannye/s_ph-1-zapresovannye
20	PH.3 запрессованные	ph-3-zapressovannye	48	\N	2025-10-25 08:45:56.818	2025-10-25 08:45:56.818	\N	structure / bity / iz-naborov / 1-4-zapressovannye / ph-3-zapressovannye	structure/d_bity/d_iz-naborov/d_1-4-zapressovannye/s_ph-3-zapressovannye
18	PH.2 запрессованая	ph-2-zapressovanaya	48	\N	2025-10-25 08:45:25.738	2025-10-25 08:46:57.765	{"Force":{"displayName":"Головка-бита Philips PH.2 1/4'' FORCE 321322","imagePath":"/media/products/19/321322.webp","productCode":"321322","updatedAt":"2025-10-25T08:46:57.764Z"}}	structure / bity / iz-naborov / 1-4-zapressovannye / ph-2-zapressovanaya	structure/d_bity/d_iz-naborov/d_1-4-zapressovannye/s_ph-2-zapressovanaya
15	6,5 шлицевая	6-5-shlitsevaya	48	\N	2025-10-25 08:43:53.643	2025-10-25 08:47:08.002	{"Force":{"displayName":"Головка-бита Slotted 1.2x6.5 мм. 1/4” FORCE 32332065","imagePath":"/media/products/18/32332065.webp","productCode":"32332065","updatedAt":"2025-10-25T08:47:08.001Z"}}	structure / bity / iz-naborov / 1-4-zapressovannye / 6-5-shlitsevaya	structure/d_bity/d_iz-naborov/d_1-4-zapressovannye/s_6-5-shlitsevaya
11	головка 8мм 6гр 1/4	golovka-8mm-6gr-1-4	36	\N	2025-10-25 08:39:02.145	2025-10-25 08:51:24.713	{"RockForce":{"displayName":"Головка 8мм (6гр.), 1/4''","imagePath":"/media/products/17/rf52508.webp","productCode":"rf52508","updatedAt":"2025-10-25T08:51:24.712Z"}}	structure / ruchnoy-instrument / golovki-tortsevye / 1-4-korotkie / golovka-8mm-6gr-1-4	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-4-korotkie/s_golovka-8mm-6gr-1-4
21	10мм (6гр.), 1/2''	10mm-6gr-1-2	50	\N	2025-10-25 08:58:41.459	2025-10-25 08:59:32.431	{"JCB":{"displayName":"Головка ударная глубокая 10мм (6гр.), 1/2''","imagePath":null,"productCode":"JCB-4458510","updatedAt":"2025-10-25T08:59:32.429Z"}}	structure / ruchnoy-instrument / golovki-tortsevye / 1-2-dlinnye / 6graney / 10mm-6gr-1-2	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-2-dlinnye/d_6graney/s_10mm-6gr-1-2
22	Съемник пистонов металические	s-emnik-pistonov-metalicheskie	53	\N	2025-10-25 09:18:35.571	2025-10-25 09:20:55.329	{"Дело техники":{"displayName":"Съёмник пистонов обшивки изогнутый 6мм","imagePath":"/media/products/21/825206.webp","productCode":"825206","updatedAt":"2025-10-25T09:20:55.327Z"}}	structure / spetsial-nyy-instrument / salon / s-emnik-pistonov / s-emnik-pistonov-metalicheskie	structure/d_spetsial-nyy-instrument/d_salon/d_s-emnik-pistonov/s_s-emnik-pistonov-metalicheskie
23	демонтажа внутренней обшивки салона 11пр	demontazha-vnutrenney-obshivki-salona-11pr	54	\N	2025-10-25 09:25:10.52	2025-10-25 09:26:33.092	{"FORCEKRAFT":{"displayName":"Набор приспособлений (пласт.) для демонтажа внутренней обшивки салона 11пр.","imagePath":"/media/products/22/FK-905M11.webp","productCode":"FK-905M11","updatedAt":"2025-10-25T09:26:33.091Z"}}	structure / spetsial-nyy-instrument / salon / plastikovye-nabory / demontazha-vnutrenney-obshivki-salona-11pr	structure/d_spetsial-nyy-instrument/d_salon/d_plastikovye-nabory/s_demontazha-vnutrenney-obshivki-salona-11pr
24	Бита TORX T55	bita-torx-t55	17	\N	2025-10-25 09:42:28.572	2025-10-25 09:43:31.46	{"RockForce":{"displayName":"Бита TORX T55х75ммL","imagePath":"/media/products/23/RF-1767555 Premium.webp","productCode":"RF-1767555 Premium","updatedAt":"2025-10-25T09:43:31.459Z"}}	structure / bity / 10mm / dlinnye / torx-17675 / bita-torx-t55	structure/d_bity/d_10mm/d_dlinnye/d_torx-17675/s_bita-torx-t55
25	Набор головок ударных глубоких 16пр	nabor-golovok-udarnyh-glubokih-16pr	56	\N	2025-10-25 09:50:16.698	2025-10-25 09:51:19.238	{"JCB":{"displayName":"Набор головок ударных глубоких 16пр.,1/2''6гр.(10,12-19,21,22,24,27,30,32,36мм), в металлическом кейсе","imagePath":"/media/products/24/JCB-4167-5MPB.webp","productCode":"JCB-4167-5MPB","updatedAt":"2025-10-25T09:51:19.237Z"}}	structure / ruchnoy-instrument / golovki-nabory / 1-2-udarnye-udlinennye / nabor-golovok-udarnyh-glubokih-16pr	structure/d_ruchnoy-instrument/d_golovki-nabory/d_1-2-udarnye-udlinennye/s_nabor-golovok-udarnyh-glubokih-16pr
27	головка 10мм 12гр  1/4	golovka-10mm-12gr-1-4	36	\N	2025-10-25 10:31:38.473	2025-10-25 10:31:38.473	\N	structure / ruchnoy-instrument / golovki-tortsevye / 1-4-korotkie / golovka-10mm-12gr-1-4	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-4-korotkie/s_golovka-10mm-12gr-1-4
32	Болт к набору для замены сайлентблоков М16	bolt-k-naboru-dlya-zameny-saylentblokov-m16	65	\N	2025-10-25 10:46:11.544	2025-10-25 10:46:11.544	\N	structure / spetsial-nyy-instrument / hodovaya-chast / saylentbloki / shpil-ki / bolt-k-naboru-dlya-zameny-saylentblokov-m16	structure/d_spetsial-nyy-instrument/d_hodovaya-chast/d_saylentbloki/d_shpil-ki/s_bolt-k-naboru-dlya-zameny-saylentblokov-m16
29	Болт к набору для замены сайлентблоков М12	bolt-k-naboru-dlya-zameny-saylentblokov-m12	65	\N	2025-10-25 10:45:53.616	2025-10-25 10:47:23.148	{"FORCEKRAFT":{"displayName":"Болт к набору для замены сайлентблоков М12","imagePath":"/media/products/27/FK-933T1-12P.webp","productCode":"FK-933T1-12P","updatedAt":"2025-10-25T10:47:23.147Z"}}	structure / spetsial-nyy-instrument / hodovaya-chast / saylentbloki / shpil-ki / bolt-k-naboru-dlya-zameny-saylentblokov-m12	structure/d_spetsial-nyy-instrument/d_hodovaya-chast/d_saylentbloki/d_shpil-ki/s_bolt-k-naboru-dlya-zameny-saylentblokov-m12
34	Шарнир ударный 1/4	sharnir-udarnyy-1-4	66	\N	2025-10-25 12:10:41.674	2025-10-25 12:10:41.674	\N	structure / ruchnoy-instrument / adaptery-perehodniki / sharnir-udarnyy / sharnir-udarnyy-1-4	structure/d_ruchnoy-instrument/d_adaptery-perehodniki/d_sharnir-udarnyy/s_sharnir-udarnyy-1-4
42	Головка 19мм 6гр ударная	golovka-19mm-6gr-udarnaya	85	\N	2025-10-27 11:25:54.226	2025-11-03 09:17:02.105	{"Дело техники":{"displayName":"Головка ударная шестигранная 19 мм 1/2\\"","imagePath":"/media/products/36/660019.webp","productCode":"660019","updatedAt":"2025-10-27T11:26:36.706Z"},"RockForce":{"displayName":"Головка ударная 19мм (6гр.), 1/2''","imagePath":"/media/products/115/RF-44519.webp","productCode":"RF-44519","updatedAt":"2025-11-03T09:17:02.104Z"}}	structure / ruchnoy-instrument / golovki-tortsevye / 1-2-korotkie / 1-2-korotkie-udarnye / 6gr / golovka-19mm-6gr-udarnaya	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-2-korotkie/d_1-2-korotkie-udarnye/d_6gr/s_golovka-19mm-6gr-udarnaya
35	Ключ для датчика ''лямбда зонд''	klyuch-dlya-datchika-lyambda-zond	69	\N	2025-10-25 12:15:27.549	2025-10-25 12:16:59.646	{"Автодело":{"displayName":"Головка разрезная для монтажа кислородного датчика 22 мм ½","imagePath":"/media/products/29/40290.webp","productCode":"40290","updatedAt":"2025-10-25T12:16:59.644Z"}}	structure / spetsial-nyy-instrument / dvigatel / datchiki / lyambda / klyuch-dlya-datchika-lyambda-zond	structure/d_spetsial-nyy-instrument/d_dvigatel/d_datchiki/d_lyambda/s_klyuch-dlya-datchika-lyambda-zond
36	головка 19мм 12гр 1/2	golovka-19mm-12gr-1-2	7	\N	2025-10-25 12:20:10.621	2025-10-25 12:21:31.345	{"Дело техники":{"displayName":"Головка двенадцатигранная 19мм 1/2\\"","imagePath":"/media/products/30/622019.webp","productCode":"622019","updatedAt":"2025-10-25T12:21:31.344Z"}}	structure / ruchnoy-instrument / golovki-tortsevye / 1-2-korotkie / 12-graney / golovka-19mm-12gr-1-2	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-2-korotkie/d_12-graney/s_golovka-19mm-12gr-1-2
33	Шарнир ударный 1/2	sharnir-udarnyy-1-2	66	\N	2025-10-25 12:10:27.983	2025-10-29 10:08:15.249	{"TOPTUL":{"displayName":"Шарнир ударный 1/2\\"х62мм TOPTUL","imagePath":"/media/products/28/KACN160B.webp","productCode":"KACN160B","updatedAt":"2025-10-29T10:08:15.247Z"}}	structure / ruchnoy-instrument / adaptery-perehodniki / sharnir-udarnyy / sharnir-udarnyy-1-2	structure/d_ruchnoy-instrument/d_adaptery-perehodniki/d_sharnir-udarnyy/s_sharnir-udarnyy-1-2
38	Набор ключей комбинированных, 16пр.	nabor-klyuchey-kombinirovannyh-16pr	75	\N	2025-10-27 10:47:11.777	2025-10-27 10:48:14.805	{"Forsage":{"displayName":"Набор ключей комбинированных, 16пр.(6-19, 22, 24мм), в пластиковом держателе","imagePath":"/media/products/32/F-5161MP.webp","productCode":"F-5161MP","updatedAt":"2025-10-27T10:48:14.804Z"}}	structure / ruchnoy-instrument / klyuchi / kombinirovannye-nabory / nabor-klyuchey-kombinirovannyh-16pr	structure/d_ruchnoy-instrument/d_klyuchi/d_kombinirovannye-nabory/s_nabor-klyuchey-kombinirovannyh-16pr
39	Набор инструментов 108пр.1/4''&1/2''(6-гран	nabor-instrumentov-108pr-1-4-1-2-6-gran	81	\N	2025-10-27 11:10:58.499	2025-10-27 11:11:59.084	{"JCB":{"displayName":"Набор инструментов 108пр.1/4''&1/2''(6-гран)(4-32мм)","imagePath":"/media/products/33/JCB-41082-5.webp","productCode":"JCB-41082-5","updatedAt":"2025-10-27T11:11:59.083Z"}}	structure / ruchnoy-instrument / nabory-instrumentov / 1-4-i-1-2 / nabor-instrumentov-108pr-1-4-1-2-6-gran	structure/d_ruchnoy-instrument/d_nabory-instrumentov/d_1-4-i-1-2/s_nabor-instrumentov-108pr-1-4-1-2-6-gran
40	Адаптер-переходник 3/8''(F)x1/2''(M)	adapter-perehodnik-3-8-f-x1-2-m	82	\N	2025-10-27 11:16:28.557	2025-10-27 11:17:09.818	{"Force":{"displayName":"Адаптер-переходник 3/8''(F)x1/2''(M)","imagePath":"/media/products/34/80634.webp","productCode":"80634","updatedAt":"2025-10-27T11:17:09.817Z"}}	structure / ruchnoy-instrument / adaptery-perehodniki / begunki-adapter-perehodnik-3-8-f-x1-2-m / adapter-perehodnik-3-8-f-x1-2-m	structure/d_ruchnoy-instrument/d_adaptery-perehodniki/d_begunki-adapter-perehodnik-3-8-f-x1-2-m/s_adapter-perehodnik-3-8-f-x1-2-m
41	Головка ударная 36мм (12гр.)	golovka-udarnaya-36mm-12gr	86	\N	2025-10-27 11:22:17.72	2025-10-27 11:23:09.286	{"FORCEKRAFT":{"displayName":"Головка ударная 36мм (12гр.), 1/2''","imagePath":"/media/products/35/FK-44836.webp","productCode":"FK-44836","updatedAt":"2025-10-27T11:23:09.285Z"}}	structure / ruchnoy-instrument / golovki-tortsevye / 1-2-korotkie / 1-2-korotkie-udarnye / 12gr / golovka-udarnaya-36mm-12gr	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-2-korotkie/d_1-2-korotkie-udarnye/d_12gr/s_golovka-udarnaya-36mm-12gr
43	Пистолет продувочный c комплектом сопел	pistolet-produvochnyy-c-komplektom-sopel	87	\N	2025-10-27 11:30:51.395	2025-10-27 11:31:33.895	{"Eco":{"displayName":"Пистолет продувочный c комплектом сопел ECO ABG-20","imagePath":"/media/products/37/ABG-20.webp","productCode":"ABG-20","updatedAt":"2025-10-27T11:31:33.892Z"}}	structure / pnevmatika / instrument / produvochnye / pistolet-produvochnyy-c-komplektom-sopel	structure/d_pnevmatika/d_instrument/d_produvochnye/s_pistolet-produvochnyy-c-komplektom-sopel
44	свечные 14мм	svechnye-14mm	88	\N	2025-10-28 09:19:14.678	2025-10-28 09:22:15.704	{"Yato":{"displayName":"Головка свечная 3/8\\" 14мм L63мм CrV \\"Yato\\"","imagePath":"/media/products/38/YT-38510.webp","productCode":"YT-38510","updatedAt":"2025-10-28T09:22:15.702Z"}}	structure / ruchnoy-instrument / golovki-tortsevye / svechnye-golovki / svechnye-14mm	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_svechnye-golovki/s_svechnye-14mm
47	Вороток 1" Г образный	vorotok-1-g-obraznyy	94	\N	2025-10-28 09:31:35.342	2025-10-28 09:31:35.342	\N	structure / ruchnoy-instrument / vorotki-g-obr / 1-duim-vorotok-gobraznyy / vorotok-1-g-obraznyy	structure/d_ruchnoy-instrument/d_vorotki-g-obr/d_1-duim-vorotok-gobraznyy/s_vorotok-1-g-obraznyy
48	Вороток 1/4 Г образный	vorotok-1-4-g-obraznyy	90	\N	2025-10-28 09:31:44.647	2025-10-28 09:31:44.647	\N	structure / ruchnoy-instrument / vorotki-g-obr / 1-4-vorotok-gobraznyy / vorotok-1-4-g-obraznyy	structure/d_ruchnoy-instrument/d_vorotki-g-obr/d_1-4-vorotok-gobraznyy/s_vorotok-1-4-g-obraznyy
49	Вороток 1/2 Г образный	vorotok-1-2-g-obraznyy	92	\N	2025-10-28 09:31:58.838	2025-10-28 09:31:58.838	\N	structure / ruchnoy-instrument / vorotki-g-obr / 1-2-vorotok-gobraznyy / vorotok-1-2-g-obraznyy	structure/d_ruchnoy-instrument/d_vorotki-g-obr/d_1-2-vorotok-gobraznyy/s_vorotok-1-2-g-obraznyy
52	бита торкс т50 75мм	bita-torks-t50-75mm	17	\N	2025-10-28 10:21:10.866	2025-10-28 10:27:13.113	{"TOPTUL":{"displayName":"Насадка TORX T50 75мм LONG TOPTUL","imagePath":"/media/products/47/FSEB1250.webp","productCode":"FSEB1250","updatedAt":"2025-10-28T10:27:13.112Z"}}	structure / bity / 10mm / dlinnye / torx-17675 / bita-torks-t50-75mm	structure/d_bity/d_10mm/d_dlinnye/d_torx-17675/s_bita-torks-t50-75mm
54	бита торкс т35 75мм	bita-torks-t35-75mm	17	\N	2025-10-28 10:29:14.864	2025-10-28 10:29:14.864	\N	structure / bity / 10mm / dlinnye / torx-17675 / bita-torks-t35-75mm	structure/d_bity/d_10mm/d_dlinnye/d_torx-17675/s_bita-torks-t35-75mm
53	бита торкс т45 75мм	bita-torks-t45-75mm	17	\N	2025-10-28 10:29:01.595	2025-10-29 08:47:42.632	{"RockForce":{"displayName":"Бита TORX T45х75ммL,10мм","imagePath":"/media/products/48/RF-1767545 Premium.webp","productCode":"RF-1767545 Premium","updatedAt":"2025-10-28T10:33:01.381Z"},"TOPTUL":{"displayName":"Насадка TORX T45 75мм LONG TOPTUL","imagePath":"/media/products/49/FSEB1245.webp","productCode":"FSEB1245","updatedAt":"2025-10-28T10:33:16.952Z"},"Force":{"displayName":"Бита Force 1767545 T45","imagePath":"/media/products/71/1767545.webp","productCode":"1767545","updatedAt":"2025-10-29T08:47:42.631Z"}}	structure / bity / 10mm / dlinnye / torx-17675 / bita-torks-t45-75mm	structure/d_bity/d_10mm/d_dlinnye/d_torx-17675/s_bita-torks-t45-75mm
51	свечные 16мм	svechnye-16mm	88	\N	2025-10-28 10:08:28.893	2025-10-28 10:14:46.941	{"RockForce":{"displayName":"Головка свечная 21мм 1/2''(6гр.)","imagePath":"/media/products/45/RF-807421.webp","productCode":"RF-807421","updatedAt":"2025-10-28T10:14:46.940Z"}}	structure / ruchnoy-instrument / golovki-tortsevye / svechnye-golovki / svechnye-16mm	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_svechnye-golovki/s_svechnye-16mm
56	бита торкс т27 75мм	bita-torks-t27-75mm	17	\N	2025-10-28 10:29:39.301	2025-10-28 10:29:39.301	\N	structure / bity / 10mm / dlinnye / torx-17675 / bita-torks-t27-75mm	structure/d_bity/d_10mm/d_dlinnye/d_torx-17675/s_bita-torks-t27-75mm
57	бита торкс т20 75мм	bita-torks-t20-75mm	17	\N	2025-10-28 10:29:50.829	2025-10-28 10:29:50.829	\N	structure / bity / 10mm / dlinnye / torx-17675 / bita-torks-t20-75mm	structure/d_bity/d_10mm/d_dlinnye/d_torx-17675/s_bita-torks-t20-75mm
58	пеньки	pen-ki	96	\N	2025-10-28 10:50:17.683	2025-10-28 10:51:21.115	{"TOPTUL":{"displayName":"Набор бит TORX с отверст. Т10-Т40 7шт. TOPTUL","imagePath":null,"productCode":"GAAV0703","updatedAt":"2025-10-28T10:51:21.114Z"}}	structure / bity / nabory-bit-1-4-1-4 / pen-ki	structure/d_bity/d_nabory-bit-1-4-1-4/s_pen-ki
46	Вороток 3/4 Г образный	vorotok-3-4-g-obraznyy	93	\N	2025-10-28 09:31:24.444	2025-11-02 11:16:24.553	{"Forsage":{"displayName":"Вороток Г-образный двухсторонний ударный CR-Mo 450мм 3/4''","imagePath":null,"productCode":"F-8156450MPB","updatedAt":"2025-11-02T11:16:24.552Z"}}	structure / ruchnoy-instrument / vorotki-g-obr / 3-4-vorotok-gobraznyy / vorotok-3-4-g-obraznyy	structure/d_ruchnoy-instrument/d_vorotki-g-obr/d_3-4-vorotok-gobraznyy/s_vorotok-3-4-g-obraznyy
55	бита торкс т30 75мм	bita-torks-t30-75mm	17	\N	2025-10-28 10:29:29.622	2025-10-28 10:45:59.422	{"Force":{"displayName":"Насадка 10мм. L-75мм. TORX T30 FORCE 1767530","imagePath":"/media/products/50/1767530.webp","productCode":"1767530","updatedAt":"2025-10-28T10:45:59.421Z"}}	structure / bity / 10mm / dlinnye / torx-17675 / bita-torks-t30-75mm	structure/d_bity/d_10mm/d_dlinnye/d_torx-17675/s_bita-torks-t30-75mm
60	бита торкс т50 30мм	bita-torks-t50-30mm	20	\N	2025-10-28 11:31:22.057	2025-10-28 11:31:22.057	\N	structure / bity / 10mm / korotkie / torx-17630 / bita-torks-t50-30mm	structure/d_bity/d_10mm/d_korotkie/d_torx-17630/s_bita-torks-t50-30mm
61	бита торкс т55 30мм	bita-torks-t55-30mm	20	\N	2025-10-28 11:31:41.308	2025-10-28 11:31:41.308	\N	structure / bity / 10mm / korotkie / torx-17630 / bita-torks-t55-30mm	structure/d_bity/d_10mm/d_korotkie/d_torx-17630/s_bita-torks-t55-30mm
59	бита торкс т45 30мм	bita-torks-t45-30mm	20	\N	2025-10-28 11:29:59.027	2025-10-28 12:03:55.919	{"TOPTUL":{"displayName":"Насадка TORX T45 30мм TOPTUL (Присоединительный размер 10мм)","imagePath":"/media/products/52/FSEA1245.webp","productCode":"FSEA1245","updatedAt":"2025-10-28T12:03:55.918Z"}}	structure / bity / 10mm / korotkie / torx-17630 / bita-torks-t45-30mm	structure/d_bity/d_10mm/d_korotkie/d_torx-17630/s_bita-torks-t45-30mm
62	ключ 32мм	klyuch-32mm	97	\N	2025-10-28 12:09:45.022	2025-10-28 12:10:35.706	{"Forsage":{"displayName":"Ключ комбинированный 32мм","imagePath":"/media/products/53/F-75532.webp","productCode":"F-75532","updatedAt":"2025-10-28T12:10:35.705Z"}}	structure / ruchnoy-instrument / klyuchi / kombinir-poshtuchno / klyuch-32mm	structure/d_ruchnoy-instrument/d_klyuchi/d_kombinir-poshtuchno/s_klyuch-32mm
45	Вороток 3/8 Г образный	vorotok-3-8-g-obraznyy	91	\N	2025-10-28 09:31:16.4	2025-10-29 08:54:56.989	{"Эврика":{"displayName":"Вороток 3/8\\" DR Г-образный 250мм на держателе ЭВРИКА","imagePath":"/media/products/39/ER-53825.webp","productCode":"ER-53825","updatedAt":"2025-10-28T09:34:07.143Z"},"Автодело":{"displayName":"Вороток Г-образн. (3/8\\"; 200*75 mm) АвтоDело","imagePath":"/media/products/72/39775.webp","productCode":"39775","updatedAt":"2025-10-29T08:54:56.988Z"}}	structure / ruchnoy-instrument / vorotki-g-obr / 3-8-vorotok-gobraznyy / vorotok-3-8-g-obraznyy	structure/d_ruchnoy-instrument/d_vorotki-g-obr/d_3-8-vorotok-gobraznyy/s_vorotok-3-8-g-obraznyy
145	сжим гнутые 175	szhim-gnutye-175	159	\N	2025-11-03 09:24:27.208	2025-11-03 09:25:49.504	{"Partner":{"displayName":"Съемник стопорных колец прямой на сжатие (L-175мм), в блистере","imagePath":"/media/products/117/PA-68-175HS.webp","productCode":"PA-68-175HS","updatedAt":"2025-11-03T09:25:49.503Z"}}	structure / ruchnoy-instrument / stopornye-kol-tsa / poshtuchno-175mm / szhim-gnutye-175	structure/d_ruchnoy-instrument/d_stopornye-kol-tsa/d_poshtuchno-175mm/s_szhim-gnutye-175
64	монтировка шинамонтажная	montirovka-shinamontazhnaya	100	\N	2025-10-28 12:31:37.157	2025-10-28 12:31:37.157	\N	structure / ruchnoy-instrument / montirovki / montirovka-shinamontazhnaya / montirovka-shinamontazhnaya	structure/d_ruchnoy-instrument/d_montirovki/d_montirovka-shinamontazhnaya/s_montirovka-shinamontazhnaya
70	1/4 динамометрический	1-4-dinamometricheskiy	104	\N	2025-10-29 07:28:28.301	2025-10-29 07:45:20.611	{"ARNEZI":{"displayName":"Ключ динамометрический 1/4' 5-25 Нм, 72 зуба, в кейсе L=245мм ARNEZI R7300141","imagePath":"/media/products/60/R7300141.webp","productCode":"R7300141","updatedAt":"2025-10-29T07:29:30.297Z"},"Хорекс Авто":{"displayName":"Вороток моментный с трещоточным механизмом 5-25 Hм 1/4\\" Хорекс Авто HZ 27.1.047W","imagePath":"/media/products/63/HZ 27.1.047W.webp","productCode":"HZ 27.1.047W","updatedAt":"2025-10-29T07:45:20.610Z"}}	structure / ruchnoy-instrument / izmeritel-nyy / dinamometricheskie-klyuchi / 1-4-dinamometricheskiy	structure/d_ruchnoy-instrument/d_izmeritel-nyy/d_dinamometricheskie-klyuchi/s_1-4-dinamometricheskiy
63	монтировка с рукояткой	montirovka-s-rukoyatkoy	99	\N	2025-10-28 12:31:23.634	2025-10-28 12:34:17.884	{"Дело техники":{"displayName":"Монтировка с рукояткой 20×590мм","imagePath":null,"productCode":"539 240","updatedAt":"2025-10-28T12:34:17.884Z"}}	structure / ruchnoy-instrument / montirovki / montirovki-s-rukoyatkoy / montirovka-s-rukoyatkoy	structure/d_ruchnoy-instrument/d_montirovki/d_montirovki-s-rukoyatkoy/s_montirovka-s-rukoyatkoy
67	8мм головка 1/2	8mm-golovka-1-2	102	\N	2025-10-28 12:42:53.581	2025-10-28 12:42:53.581	\N	structure / spetsial-nyy-instrument / zamena-masla / klyuch-golovka-kvadrat-1-2 / 8mm-golovka-1-2	structure/d_spetsial-nyy-instrument/d_zamena-masla/d_klyuch-golovka-kvadrat-1-2/s_8mm-golovka-1-2
68	10мм-головка 1/2	10mm-golovka-1-2	102	\N	2025-10-28 12:43:03.858	2025-10-28 12:43:03.858	\N	structure / spetsial-nyy-instrument / zamena-masla / klyuch-golovka-kvadrat-1-2 / 10mm-golovka-1-2	structure/d_spetsial-nyy-instrument/d_zamena-masla/d_klyuch-golovka-kvadrat-1-2/s_10mm-golovka-1-2
66	10мм-кочерга	10mm-kocherga	101	\N	2025-10-28 12:42:04.792	2025-10-28 12:45:21.656	{"Дело техники":{"displayName":"Ключ четырехгранный 10мм","imagePath":"/media/products/58/560 010.webp","productCode":"560 010","updatedAt":"2025-10-28T12:45:21.655Z"}}	structure / spetsial-nyy-instrument / zamena-masla / klyuch-kocherga / 10mm-kocherga	structure/d_spetsial-nyy-instrument/d_zamena-masla/d_klyuch-kocherga/s_10mm-kocherga
65	8мм-кочерга	8mm-kocherga	101	\N	2025-10-28 12:41:55.114	2025-10-28 12:45:25.294	{"Дело техники":{"displayName":"Ключ четырехгранный 8мм","imagePath":"/media/products/57/560 008.webp","productCode":"560 008","updatedAt":"2025-10-28T12:45:25.293Z"}}	structure / spetsial-nyy-instrument / zamena-masla / klyuch-kocherga / 8mm-kocherga	structure/d_spetsial-nyy-instrument/d_zamena-masla/d_klyuch-kocherga/s_8mm-kocherga
69	бита сплайн м07 30мм	bita-splayn-m07-30mm	25	\N	2025-10-29 06:16:44.865	2025-10-29 06:18:11.374	{"Force":{"displayName":"ита- сплайн М7 30мм Force 1783007","imagePath":"/media/products/59/1783007.webp","productCode":"1783007","updatedAt":"2025-10-29T06:18:11.372Z"}}	structure / bity / 10mm / korotkie / spine-17830 / bita-splayn-m07-30mm	structure/d_bity/d_10mm/d_korotkie/d_spine-17830/s_bita-splayn-m07-30mm
72	1/2 динамометрические	1-2-dinamometricheskie	104	\N	2025-10-29 07:32:12.164	2025-10-29 07:34:55.7	{"ARNEZI":{"displayName":"Ключ динамометрический 1/2 20-210 Нм, 72 зуба, в кейсе L=490мм ARNEZI R7300121","imagePath":"/media/products/61/R7300121.webp","productCode":"R7300121","updatedAt":"2025-10-29T07:34:55.699Z"}}	structure / ruchnoy-instrument / izmeritel-nyy / dinamometricheskie-klyuchi / 1-2-dinamometricheskie	structure/d_ruchnoy-instrument/d_izmeritel-nyy/d_dinamometricheskie-klyuchi/s_1-2-dinamometricheskie
73	трещотка металлическая 1/4	treschotka-metallicheskaya-1-4	108	\N	2025-10-29 08:13:12.74	2025-10-29 08:16:14.097	{"TOPTUL":{"displayName":"Трещотка 1/4\\" 36зуб. 131мм TOPTUL","imagePath":"/media/products/64/CHAG0813.webp","productCode":"CHAG0813","updatedAt":"2025-10-29T08:16:14.096Z"}}	structure / ruchnye-treschotki / treschotki-ruchnye-1-4 / treschotka-metallicheskaya-1-4	structure/d_ruchnye-treschotki/d_treschotki-ruchnye-1-4/s_treschotka-metallicheskaya-1-4
37	1/4" Трещотка [80222]	1-4-treschotka-80222	71	\N	2025-10-25 12:48:44.218	2025-10-29 08:24:09.028	{"RockForce":{"displayName":"Трещотка реверсивная усиленная изогнутая с резиновой ручкой 1/4''(72зуб.)","imagePath":"/media/products/31/rf802222.webp","productCode":"rf802222","updatedAt":"2025-10-25T12:50:22.218Z"},"Baum":{"displayName":"Ключ трещоточный 1/4''(72зуб)","imagePath":"/media/products/65/BM-802222.webp","productCode":"BM-802222","updatedAt":"2025-10-29T08:24:09.026Z"}}	structure / ruchnoy-instrument / treschotki / 1-4-treschotki / 1-4-treschotka-80222	structure/d_ruchnoy-instrument/d_treschotki/d_1-4-treschotki/s_1-4-treschotka-80222
71	3/8 динамометрические	3-8-dinamometricheskie	104	\N	2025-10-29 07:32:02.562	2025-10-30 07:47:02.786	{"ARNEZI":{"displayName":"ключ динамометрический! 3/8 5-25нм, 72 зуба, в кейсе\\\\ R7300381 ARNEZI","imagePath":"/media/products/87/R7300381.webp","productCode":"R7300381","updatedAt":"2025-10-30T07:47:02.784Z"}}	structure / ruchnoy-instrument / izmeritel-nyy / dinamometricheskie-klyuchi / 3-8-dinamometricheskie	structure/d_ruchnoy-instrument/d_izmeritel-nyy/d_dinamometricheskie-klyuchi/s_3-8-dinamometricheskie
75	Метчик 14мм	metchik-14mm	113	\N	2025-10-29 08:33:58.441	2025-10-29 08:35:01.622	{"Scheppach":{"displayName":"Метчик M14x1,5 (3шт)","imagePath":"/media/products/68/Sch-TAP14x1.5.webp","productCode":"Sch-TAP14x1.5","updatedAt":"2025-10-29T08:35:01.621Z"}}	structure / metalloobrabotka / metchiki-plashki-vorotki / metchiki-poshtuchno / metchik-14mm	structure/d_metalloobrabotka/d_metchiki-plashki-vorotki/d_metchiki-poshtuchno/s_metchik-14mm
77	Переставные 250мм	perestavnye-250mm	117	\N	2025-10-29 08:38:35.825	2025-10-29 08:38:35.825	\N	structure / ruchnoy-instrument / sharnirno-gubtsevyy / kleschi-perestavnye / perestavnye-250mm	structure/d_ruchnoy-instrument/d_sharnirno-gubtsevyy/d_kleschi-perestavnye/s_perestavnye-250mm
78	Переставные специальные	perestavnye-spetsial-nye	117	\N	2025-10-29 08:39:03.632	2025-10-29 08:39:03.632	\N	structure / ruchnoy-instrument / sharnirno-gubtsevyy / kleschi-perestavnye / perestavnye-spetsial-nye	structure/d_ruchnoy-instrument/d_sharnirno-gubtsevyy/d_kleschi-perestavnye/s_perestavnye-spetsial-nye
76	Переставные 300мм	perestavnye-300mm	117	\N	2025-10-29 08:38:23.681	2025-10-29 08:39:41.938	{"Эврика":{"displayName":"Клещи переставные ER-13130 универсальные, покрытие черное порошковое 300мм ЭВРИКА 1/36","imagePath":"/media/products/69/ER13130.webp","productCode":"ER13130","updatedAt":"2025-10-29T08:39:41.937Z"}}	structure / ruchnoy-instrument / sharnirno-gubtsevyy / kleschi-perestavnye / perestavnye-300mm	structure/d_ruchnoy-instrument/d_sharnirno-gubtsevyy/d_kleschi-perestavnye/s_perestavnye-300mm
50	щетки ручные	schetki-ruchnye	95	\N	2025-10-28 09:39:43.883	2025-10-29 08:44:05.665	{"STARTUL":{"displayName":"Щетка латунированная STARTUL STANDART (ST5025) (проволочная, пластмассовая рукоятка)","imagePath":"/media/products/40/ST5025.webp","productCode":"ST5025","updatedAt":"2025-10-28T09:40:48.255Z"},"RockForce":{"displayName":"Щетка ручная по металлу с пластиковой ручкой(L общ-260мм, L раб.-140мм)","imagePath":"/media/products/42/RF-HB140.webp","productCode":"RF-HB140","updatedAt":"2025-10-28T09:46:16.557Z"},"Forsage":{"displayName":"Щетка по металлу ручная в пластиковом корпусе с прорезиненной рукояткой (металлический скребок-40мм, высокоуглеродистая сталь, 3x19рядов)","imagePath":"/media/products/43/F-340122113.webp","productCode":"F-340122113","updatedAt":"2025-10-28T09:54:44.668Z"},"Автодело":{"displayName":"Щетка металлическая 6-рядная с пластиковой ручкой (АвтоDело) 44016","imagePath":null,"productCode":"44016","updatedAt":"2025-10-28T09:54:49.468Z"},"Дело техники":{"displayName":"Щётка-мини с прорезиненной рукояткой, щетина из нержавеющей стали","imagePath":"/media/products/70/270055.webp","productCode":"270055","updatedAt":"2025-10-29T08:44:05.664Z"}}	structure / metalloobrabotka / schetki-ruchnye / schetki-ruchnye	structure/d_metalloobrabotka/d_schetki-ruchnye/s_schetki-ruchnye
79	щетки для направляющих stab	schetki-dlya-napravlyayuschih-stab	95	\N	2025-10-29 08:57:25.302	2025-10-29 08:58:14.206	{"Stab":{"displayName":"Щетка для чистки каналов","imagePath":"/media/products/73/SB31020.webp","productCode":"SB31020","updatedAt":"2025-10-29T08:58:14.205Z"}}	structure / metalloobrabotka / schetki-ruchnye / schetki-dlya-napravlyayuschih-stab	structure/d_metalloobrabotka/d_schetki-ruchnye/s_schetki-dlya-napravlyayuschih-stab
80	Съемник рулевых тяг универсальный 27-42мм	s-emnik-rulevyh-tyag-universal-nyy-27-42mm	118	\N	2025-10-29 09:02:27.904	2025-10-29 09:03:15.003	{"RockForce":{"displayName":"Съемник рулевых тяг универсальный 27-42мм, 1/2''","imagePath":"/media/products/74/RF-9T0801.webp","productCode":"RF-9T0801","updatedAt":"2025-10-29T09:03:15.002Z"}}	structure / spetsial-nyy-instrument / hodovaya-chast / tyagi / s-emnik-rulevyh-tyag-universal-nyy-27-42mm	structure/d_spetsial-nyy-instrument/d_hodovaya-chast/d_tyagi/s_s-emnik-rulevyh-tyag-universal-nyy-27-42mm
74	трещотка обрезиненная 1/4	treschotka-obrezinennaya-1-4	108	\N	2025-10-29 08:25:54.224	2025-10-29 09:09:46.902	{"TOPTUL":{"displayName":"Трещотка 1/4\\" 36зуб. 150мм TOPTUL","imagePath":"/media/products/66/CJBG0815.webp","productCode":"CJBG0815","updatedAt":"2025-10-29T08:27:01.444Z"},"Force":{"displayName":"Трещотка 1/4'' 24 зуб. 155 мм Force 80222","imagePath":"/media/products/67/80222.webp","productCode":"80222","updatedAt":"2025-10-29T08:29:55.691Z"},"Дело техники":{"displayName":"Трещотка 45 зубцов 1/4\\"","imagePath":"/media/products/75/608 745.webp","productCode":"608 745","updatedAt":"2025-10-29T09:09:46.901Z"}}	structure / ruchnye-treschotki / treschotki-ruchnye-1-4 / treschotka-obrezinennaya-1-4	structure/d_ruchnye-treschotki/d_treschotki-ruchnye-1-4/s_treschotka-obrezinennaya-1-4
81	метчик 12мм	metchik-12mm	113	\N	2025-10-29 09:16:43.07	2025-10-29 09:17:33.045	{"Scheppach":{"displayName":"Метчик M12x1,75 (3шт)","imagePath":"/media/products/76/Sch-TAP12x1.75.webp","productCode":"Sch-TAP12x1.75","updatedAt":"2025-10-29T09:17:33.044Z"}}	structure / metalloobrabotka / metchiki-plashki-vorotki / metchiki-poshtuchno / metchik-12mm	structure/d_metalloobrabotka/d_metchiki-plashki-vorotki/d_metchiki-poshtuchno/s_metchik-12mm
82	Метчик 10мм	metchik-10mm	113	\N	2025-10-29 09:20:52.064	2025-10-29 09:25:18.824	{"Scheppach":{"displayName":"Метчик M10x1,5 (3шт)","imagePath":"/media/products/78/Sch-TAP10x1,5.webp","productCode":"Sch-TAP10x1,5","updatedAt":"2025-10-29T09:23:22.802Z"},"Эврика":{"displayName":"Метчик ER-01010M M10x1 (2шт),в пластиковом футляре ЭВРИКА /1","imagePath":"/media/products/79/ER01010M.webp","productCode":"ER01010M","updatedAt":"2025-10-29T09:25:18.822Z"}}	structure / metalloobrabotka / metchiki-plashki-vorotki / metchiki-poshtuchno / metchik-10mm	structure/d_metalloobrabotka/d_metchiki-plashki-vorotki/d_metchiki-poshtuchno/s_metchik-10mm
83	метчик 9мм	metchik-9mm	113	\N	2025-10-29 09:28:04.469	2025-10-29 09:29:18.034	{"Scheppach":{"displayName":"Метчик M9x1 (3шт)","imagePath":"/media/products/80/Sch-TAP9x1.webp","productCode":"Sch-TAP9x1","updatedAt":"2025-10-29T09:29:18.032Z"}}	structure / metalloobrabotka / metchiki-plashki-vorotki / metchiki-poshtuchno / metchik-9mm	structure/d_metalloobrabotka/d_metchiki-plashki-vorotki/d_metchiki-poshtuchno/s_metchik-9mm
84	Метчик 8мм	metchik-8mm	113	\N	2025-10-29 09:30:18.728	2025-10-29 09:32:55.646	{"Scheppach":{"displayName":"Метчик M8x1 (3шт)","imagePath":"/media/products/82/Sch-TAP8x1.webp","productCode":"Sch-TAP8x1","updatedAt":"2025-10-29T09:32:55.645Z"}}	structure / metalloobrabotka / metchiki-plashki-vorotki / metchiki-poshtuchno / metchik-8mm	structure/d_metalloobrabotka/d_metchiki-plashki-vorotki/d_metchiki-poshtuchno/s_metchik-8mm
85	Головка 27мм 3/4 длинная	golovka-27mm-3-4-dlinnaya	41	\N	2025-10-29 09:54:02.286	2025-10-29 09:56:13.53	{"FORCEKRAFT":{"displayName":"Головка ударная глубокая 27мм (6гр.), 3/4''","imagePath":"/media/products/83/FK-46510027.webp","productCode":"FK-46510027","updatedAt":"2025-10-29T09:56:13.524Z"}}	structure / ruchnoy-instrument / golovki-tortsevye / 3-4-dlinnye / golovka-27mm-3-4-dlinnaya	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_3-4-dlinnye/s_golovka-27mm-3-4-dlinnaya
146	разжим гнутые 175	razzhim-gnutye-175	159	\N	2025-11-03 09:24:33.712	2025-11-03 09:24:33.712	\N	structure / ruchnoy-instrument / stopornye-kol-tsa / poshtuchno-175mm / razzhim-gnutye-175	structure/d_ruchnoy-instrument/d_stopornye-kol-tsa/d_poshtuchno-175mm/s_razzhim-gnutye-175
87	Съемник клемм АКБ и поводков стеклоочистителя	s-emnik-klemm-akb-i-povodkov-stekloochistitelya	121	\N	2025-10-29 10:43:09.012	2025-10-29 10:43:55.342	{"Хорекс Авто":{"displayName":"Съемник клемм АКБ и поводков стеклоочистителя Хорекс Авто","imagePath":"/media/products/85/HZ 25.1.281W.webp","productCode":"HZ 25.1.281W","updatedAt":"2025-10-29T10:43:55.337Z"}}	structure / spetsial-nyy-instrument / s-emniki / s-emnik-dvornikov / s-emnik-klemm-akb-i-povodkov-stekloochistitelya	structure/d_spetsial-nyy-instrument/d_s-emniki/d_s-emnik-dvornikov/s_s-emnik-klemm-akb-i-povodkov-stekloochistitelya
88	трещотка 1/2 с резиновой ручкой	treschotka-1-2-s-rezinovoy-ruchkoy	110	\N	2025-10-29 10:49:10.26	2025-10-29 10:50:11.392	{"Дело техники":{"displayName":"Трещотка 45 зубцов 1/2\\"","imagePath":"/media/products/86/628 745.webp","productCode":"628 745","updatedAt":"2025-10-29T10:50:11.391Z"}}	structure / ruchnye-treschotki / treschotki-ruchnye-1-2 / treschotka-1-2-s-rezinovoy-ruchkoy	structure/d_ruchnye-treschotki/d_treschotki-ruchnye-1-2/s_treschotka-1-2-s-rezinovoy-ruchkoy
91	ключ 5,5	klyuch-5-5	97	\N	2025-10-30 07:49:57.746	2025-10-30 07:49:57.746	\N	structure / ruchnoy-instrument / klyuchi / kombinir-poshtuchno / klyuch-5-5	structure/d_ruchnoy-instrument/d_klyuchi/d_kombinir-poshtuchno/s_klyuch-5-5
92	ключ 6мм	klyuch-6mm	97	\N	2025-10-30 07:50:10.004	2025-10-30 07:50:10.004	\N	structure / ruchnoy-instrument / klyuchi / kombinir-poshtuchno / klyuch-6mm	structure/d_ruchnoy-instrument/d_klyuchi/d_kombinir-poshtuchno/s_klyuch-6mm
93	ключ 7мм	klyuch-7mm	97	\N	2025-10-30 07:50:17.178	2025-10-30 07:50:17.178	\N	structure / ruchnoy-instrument / klyuchi / kombinir-poshtuchno / klyuch-7mm	structure/d_ruchnoy-instrument/d_klyuchi/d_kombinir-poshtuchno/s_klyuch-7mm
94	ключ 9мм	klyuch-9mm	97	\N	2025-10-30 07:50:24.071	2025-10-30 07:50:24.071	\N	structure / ruchnoy-instrument / klyuchi / kombinir-poshtuchno / klyuch-9mm	structure/d_ruchnoy-instrument/d_klyuchi/d_kombinir-poshtuchno/s_klyuch-9mm
95	ключ 11мм	klyuch-11mm	97	\N	2025-10-30 07:50:30.155	2025-10-30 07:50:30.155	\N	structure / ruchnoy-instrument / klyuchi / kombinir-poshtuchno / klyuch-11mm	structure/d_ruchnoy-instrument/d_klyuchi/d_kombinir-poshtuchno/s_klyuch-11mm
96	ключ 12мм	klyuch-12mm	97	\N	2025-10-30 07:50:36.343	2025-10-30 07:50:36.343	\N	structure / ruchnoy-instrument / klyuchi / kombinir-poshtuchno / klyuch-12mm	structure/d_ruchnoy-instrument/d_klyuchi/d_kombinir-poshtuchno/s_klyuch-12mm
97	ключ 13мм	klyuch-13mm	97	\N	2025-10-30 07:50:43.532	2025-10-30 07:50:43.532	\N	structure / ruchnoy-instrument / klyuchi / kombinir-poshtuchno / klyuch-13mm	structure/d_ruchnoy-instrument/d_klyuchi/d_kombinir-poshtuchno/s_klyuch-13mm
98	ключ 14мм	klyuch-14mm	97	\N	2025-10-30 07:50:50.043	2025-10-30 07:50:50.043	\N	structure / ruchnoy-instrument / klyuchi / kombinir-poshtuchno / klyuch-14mm	structure/d_ruchnoy-instrument/d_klyuchi/d_kombinir-poshtuchno/s_klyuch-14mm
99	ключ 15мм	klyuch-15mm	97	\N	2025-10-30 07:50:56.116	2025-10-30 07:50:56.116	\N	structure / ruchnoy-instrument / klyuchi / kombinir-poshtuchno / klyuch-15mm	structure/d_ruchnoy-instrument/d_klyuchi/d_kombinir-poshtuchno/s_klyuch-15mm
100	ключ 16мм	klyuch-16mm	97	\N	2025-10-30 07:51:04.407	2025-10-30 07:51:04.407	\N	structure / ruchnoy-instrument / klyuchi / kombinir-poshtuchno / klyuch-16mm	structure/d_ruchnoy-instrument/d_klyuchi/d_kombinir-poshtuchno/s_klyuch-16mm
101	ключ 17мм	klyuch-17mm	97	\N	2025-10-30 07:51:10.32	2025-10-30 07:51:10.32	\N	structure / ruchnoy-instrument / klyuchi / kombinir-poshtuchno / klyuch-17mm	structure/d_ruchnoy-instrument/d_klyuchi/d_kombinir-poshtuchno/s_klyuch-17mm
102	ключ 18мм	klyuch-18mm	97	\N	2025-10-30 07:51:18.209	2025-10-30 07:51:18.209	\N	structure / ruchnoy-instrument / klyuchi / kombinir-poshtuchno / klyuch-18mm	structure/d_ruchnoy-instrument/d_klyuchi/d_kombinir-poshtuchno/s_klyuch-18mm
103	ключ 19мм	klyuch-19mm	97	\N	2025-10-30 07:51:33.978	2025-10-30 07:51:33.978	\N	structure / ruchnoy-instrument / klyuchi / kombinir-poshtuchno / klyuch-19mm	structure/d_ruchnoy-instrument/d_klyuchi/d_kombinir-poshtuchno/s_klyuch-19mm
104	ключ 20мм	klyuch-20mm	97	\N	2025-10-30 07:51:41.994	2025-10-30 07:51:41.994	\N	structure / ruchnoy-instrument / klyuchi / kombinir-poshtuchno / klyuch-20mm	structure/d_ruchnoy-instrument/d_klyuchi/d_kombinir-poshtuchno/s_klyuch-20mm
105	ключ 21мм	klyuch-21mm	97	\N	2025-10-30 07:51:47.635	2025-10-30 07:51:47.635	\N	structure / ruchnoy-instrument / klyuchi / kombinir-poshtuchno / klyuch-21mm	structure/d_ruchnoy-instrument/d_klyuchi/d_kombinir-poshtuchno/s_klyuch-21mm
106	ключ 22мм	klyuch-22mm	97	\N	2025-10-30 07:51:53.763	2025-10-30 07:51:53.763	\N	structure / ruchnoy-instrument / klyuchi / kombinir-poshtuchno / klyuch-22mm	structure/d_ruchnoy-instrument/d_klyuchi/d_kombinir-poshtuchno/s_klyuch-22mm
107	ключ 23мм	klyuch-23mm	97	\N	2025-10-30 07:52:00.759	2025-10-30 07:52:00.759	\N	structure / ruchnoy-instrument / klyuchi / kombinir-poshtuchno / klyuch-23mm	structure/d_ruchnoy-instrument/d_klyuchi/d_kombinir-poshtuchno/s_klyuch-23mm
108	ключ 24мм	klyuch-24mm	97	\N	2025-10-30 07:52:06.605	2025-10-30 07:52:06.605	\N	structure / ruchnoy-instrument / klyuchi / kombinir-poshtuchno / klyuch-24mm	structure/d_ruchnoy-instrument/d_klyuchi/d_kombinir-poshtuchno/s_klyuch-24mm
109	ключ 25мм	klyuch-25mm	97	\N	2025-10-30 07:52:12.142	2025-10-30 07:52:12.142	\N	structure / ruchnoy-instrument / klyuchi / kombinir-poshtuchno / klyuch-25mm	structure/d_ruchnoy-instrument/d_klyuchi/d_kombinir-poshtuchno/s_klyuch-25mm
110	ключ 26мм	klyuch-26mm	97	\N	2025-10-30 07:52:18.315	2025-10-30 07:52:18.315	\N	structure / ruchnoy-instrument / klyuchi / kombinir-poshtuchno / klyuch-26mm	structure/d_ruchnoy-instrument/d_klyuchi/d_kombinir-poshtuchno/s_klyuch-26mm
111	ключ 27мм	klyuch-27mm	97	\N	2025-10-30 07:52:24.355	2025-10-30 07:52:24.355	\N	structure / ruchnoy-instrument / klyuchi / kombinir-poshtuchno / klyuch-27mm	structure/d_ruchnoy-instrument/d_klyuchi/d_kombinir-poshtuchno/s_klyuch-27mm
112	ключ 28мм	klyuch-28mm	97	\N	2025-10-30 07:52:31.967	2025-10-30 07:52:31.967	\N	structure / ruchnoy-instrument / klyuchi / kombinir-poshtuchno / klyuch-28mm	structure/d_ruchnoy-instrument/d_klyuchi/d_kombinir-poshtuchno/s_klyuch-28mm
113	ключ 30мм	klyuch-30mm	97	\N	2025-10-30 07:52:42.696	2025-10-30 07:52:42.696	\N	structure / ruchnoy-instrument / klyuchi / kombinir-poshtuchno / klyuch-30mm	structure/d_ruchnoy-instrument/d_klyuchi/d_kombinir-poshtuchno/s_klyuch-30mm
114	ключ 34мм	klyuch-34mm	97	\N	2025-10-30 07:52:50.973	2025-10-30 07:52:50.973	\N	structure / ruchnoy-instrument / klyuchi / kombinir-poshtuchno / klyuch-34mm	structure/d_ruchnoy-instrument/d_klyuchi/d_kombinir-poshtuchno/s_klyuch-34mm
115	ключ 36мм	klyuch-36mm	97	\N	2025-10-30 07:52:56.727	2025-10-30 07:52:56.727	\N	structure / ruchnoy-instrument / klyuchi / kombinir-poshtuchno / klyuch-36mm	structure/d_ruchnoy-instrument/d_klyuchi/d_kombinir-poshtuchno/s_klyuch-36mm
89	ключ 10мм	klyuch-10mm	97	\N	2025-10-30 07:49:17.752	2025-10-30 07:54:28.39	{"JCB":{"displayName":"Ключ комбинированный 10мм","imagePath":"/media/products/88/JCB-75510.webp","productCode":"JCB-75510","updatedAt":"2025-10-30T07:54:28.389Z"}}	structure / ruchnoy-instrument / klyuchi / kombinir-poshtuchno / klyuch-10mm	structure/d_ruchnoy-instrument/d_klyuchi/d_kombinir-poshtuchno/s_klyuch-10mm
90	ключ 8мм	klyuch-8mm	97	\N	2025-10-30 07:49:28.531	2025-10-30 07:58:49.026	{"JCB":{"displayName":"Ключ комбинированный 10мм","imagePath":"/media/products/89/JCB-75508.webp","productCode":"JCB-75508","updatedAt":"2025-10-30T07:58:49.024Z"}}	structure / ruchnoy-instrument / klyuchi / kombinir-poshtuchno / klyuch-8mm	structure/d_ruchnoy-instrument/d_klyuchi/d_kombinir-poshtuchno/s_klyuch-8mm
116	Рукоятка для головок 1/4'	rukoyatka-dlya-golovok-1-4	122	\N	2025-10-30 08:11:37.258	2025-10-30 08:14:01.624	{"Дело техники":{"displayName":"Рукоятка 150 мм 1/4","imagePath":null,"productCode":"608815","updatedAt":"2025-10-30T08:13:34.205Z"},"RockForce":{"displayName":"Рукоятка для головок 1/4''(6''-150мм)","imagePath":"/media/products/90/RF-8143.webp","productCode":"RF-8143","updatedAt":"2025-10-30T08:14:01.623Z"}}	structure / ruchnoy-instrument / bitoderzhateli-rukoyatki / rukoyatka-dlya-golovok-1-4	structure/d_ruchnoy-instrument/d_bitoderzhateli-rukoyatki/s_rukoyatka-dlya-golovok-1-4
122	притирка клапанов на дрель	pritirka-klapanov-na-drel	135	\N	2025-11-02 10:29:15.395	2025-11-02 10:33:31.51	{"Автодело":{"displayName":"Приспособление для притирки клапанов механическое (для электрической дрели), 6 предметов (\\"АвтоDело\\") (40574)","imagePath":"/media/products/99/40574.webp","productCode":"40574","updatedAt":"2025-11-02T10:33:31.509Z"}}	structure / spetsial-nyy-instrument / dvigatel / gbts / pritirka-klapanov / pritirka-klapanov-na-drel	structure/d_spetsial-nyy-instrument/d_dvigatel/d_gbts/d_pritirka-klapanov/s_pritirka-klapanov-na-drel
117	головка 7мм	golovka-7mm	36	\N	2025-10-30 08:32:55.899	2025-10-30 08:37:58.68	{"Дело техники":{"displayName":"Головка шестигранная 7 мм 1/4\\"","imagePath":"/media/products/92/600 057.webp","productCode":"600 057","updatedAt":"2025-10-30T08:33:56.135Z"},"TOPTUL":{"displayName":"Головка 1/4\\" 7мм 6гр.TOPTUL","imagePath":"/media/products/93/BAEA0807.webp","productCode":"BAEA0807","updatedAt":"2025-10-30T08:37:58.679Z"}}	structure / ruchnoy-instrument / golovki-tortsevye / 1-4-korotkie / golovka-7mm	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-4-korotkie/s_golovka-7mm
118	зубила для молотков	zubila-dlya-molotkov	124	\N	2025-10-30 09:40:58.6	2025-10-30 09:42:34.811	{"TOPTUL":{"displayName":"Зубило для пневмомолотка по листовому металлу 178мм TOPTUL","imagePath":"/media/products/94/KAJA18C1.webp","productCode":"KAJA18C1","updatedAt":"2025-10-30T09:42:34.810Z"}}	structure / pnevmatika / instrument / otboynye-molotki / zubila / zubila-dlya-molotkov	structure/d_pnevmatika/d_instrument/d_otboynye-molotki/d_zubila/s_zubila-dlya-molotkov
119	адаптер переходник 1/2 на 1/7	adapter-perehodnik-1-2-na-1-7	127	\N	2025-10-30 09:49:52.545	2025-10-30 09:52:41.901	{"Force":{"displayName":"Адаптер для головок 1/2''(F)х1/4''(M) L36 мм Force","imagePath":"/media/products/95/80942.webp","productCode":"80942","updatedAt":"2025-10-30T09:52:41.900Z"}}	structure / ruchnoy-instrument / adaptery-perehodniki / perehodnik-1-2 / adapter-perehodnik-1-2-na-1-7	structure/d_ruchnoy-instrument/d_adaptery-perehodniki/d_perehodnik-1-2/s_adapter-perehodnik-1-2-na-1-7
120	Головки TORX 1/4"  - е8	golovki-torx-1-4-e8	130	\N	2025-10-30 09:58:52.71	2025-10-30 10:02:25.608	{"Дело техники":{"displayName":"Головка TORX E8 1/4\\"","imagePath":"/media/products/96/603 008.webp","productCode":"603 008","updatedAt":"2025-10-30T10:02:25.606Z"}}	structure / ruchnoy-instrument / golovki-tortsevye / golovki-e-profil / e-1-4-poshtuchno / golovki-torx-1-4-e8	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_golovki-e-profil/d_e-1-4-poshtuchno/s_golovki-torx-1-4-e8
121	гайколомы дело технка	gaykolomy-delo-tehnka	133	\N	2025-10-30 10:07:11.869	2025-10-30 10:08:38.339	{"Дело техники":{"displayName":"Гайколом 12-16мм","imagePath":"/media/products/97/839 816.webp","productCode":"839 816","updatedAt":"2025-10-30T10:08:38.337Z"}}	structure / spetsial-nyy-instrument / gaykolomy-gaykokoly / gaykolomy-delo-tehnka	structure/d_spetsial-nyy-instrument/d_gaykolomy-gaykokoly/s_gaykolomy-delo-tehnka
124	Ключ Г-образный 6-гранный 12мм	klyuch-g-obraznyy-6-grannyy-12mm	136	\N	2025-11-02 10:39:16.769	2025-11-02 10:39:16.769	\N	structure / ruchnoy-instrument / g-obraznye-klyuchi-hex-torx / klyuch-g-obraznyy-6-grannyy-12mm	structure/d_ruchnoy-instrument/d_g-obraznye-klyuchi-hex-torx/s_klyuch-g-obraznyy-6-grannyy-12mm
125	Ключ Г-образный 6-гранный 14мм	klyuch-g-obraznyy-6-grannyy-14mm	136	\N	2025-11-02 10:39:23.646	2025-11-02 10:39:23.646	\N	structure / ruchnoy-instrument / g-obraznye-klyuchi-hex-torx / klyuch-g-obraznyy-6-grannyy-14mm	structure/d_ruchnoy-instrument/d_g-obraznye-klyuchi-hex-torx/s_klyuch-g-obraznyy-6-grannyy-14mm
123	Ключ Г-образный 6-гранный 13мм	klyuch-g-obraznyy-6-grannyy-13mm	136	\N	2025-11-02 10:39:10.124	2025-11-02 10:40:55.121	{"JCB":{"displayName":"Ключ Г-образный 6-гранный 13мм","imagePath":"/media/products/100/JCB-76413.webp","productCode":"JCB-76413","updatedAt":"2025-11-02T10:40:55.119Z"}}	structure / ruchnoy-instrument / g-obraznye-klyuchi-hex-torx / klyuch-g-obraznyy-6-grannyy-13mm	structure/d_ruchnoy-instrument/d_g-obraznye-klyuchi-hex-torx/s_klyuch-g-obraznyy-6-grannyy-13mm
126	Ключ Г-образный 6-гранный 16мм	klyuch-g-obraznyy-6-grannyy-16mm	136	\N	2025-11-02 10:39:31.986	2025-11-02 10:44:15.388	{"JCB":{"displayName":"Ключ Г-образный 6-гранный 16мм","imagePath":"/media/products/101/JCB-76416.webp","productCode":"JCB-76416","updatedAt":"2025-11-02T10:44:15.387Z"}}	structure / ruchnoy-instrument / g-obraznye-klyuchi-hex-torx / klyuch-g-obraznyy-6-grannyy-16mm	structure/d_ruchnoy-instrument/d_g-obraznye-klyuchi-hex-torx/s_klyuch-g-obraznyy-6-grannyy-16mm
128	Ключ Г-образный 6-гранный 18мм	klyuch-g-obraznyy-6-grannyy-18mm	136	\N	2025-11-02 10:39:49.669	2025-11-02 10:49:16.388	{"JCB":{"displayName":"Ключ Г-образный 6-гранный 18мм","imagePath":"/media/products/102/JCB-76418.webp","productCode":"JCB-76418","updatedAt":"2025-11-02T10:49:16.387Z"}}	structure / ruchnoy-instrument / g-obraznye-klyuchi-hex-torx / klyuch-g-obraznyy-6-grannyy-18mm	structure/d_ruchnoy-instrument/d_g-obraznye-klyuchi-hex-torx/s_klyuch-g-obraznyy-6-grannyy-18mm
127	Ключ Г-образный 6-гранный 17мм	klyuch-g-obraznyy-6-grannyy-17mm	136	\N	2025-11-02 10:39:43.181	2025-11-02 10:49:11.659	{"JCB":{"displayName":"Ключ Г-образный 6-гранный 17мм","imagePath":"/media/products/104/JCB-76417.webp","productCode":"JCB-76417","updatedAt":"2025-11-02T10:49:11.658Z"}}	structure / ruchnoy-instrument / g-obraznye-klyuchi-hex-torx / klyuch-g-obraznyy-6-grannyy-17mm	structure/d_ruchnoy-instrument/d_g-obraznye-klyuchi-hex-torx/s_klyuch-g-obraznyy-6-grannyy-17mm
129	Ключ Г-образный 6-гранный 19мм	klyuch-g-obraznyy-6-grannyy-19mm	136	\N	2025-11-02 10:39:56.812	2025-11-02 10:49:20.932	{"JCB":{"displayName":"Ключ Г-образный 6-гранный 19мм","imagePath":"/media/products/103/JCB-76419.webp","productCode":"JCB-76419","updatedAt":"2025-11-02T10:49:20.931Z"}}	structure / ruchnoy-instrument / g-obraznye-klyuchi-hex-torx / klyuch-g-obraznyy-6-grannyy-19mm	structure/d_ruchnoy-instrument/d_g-obraznye-klyuchi-hex-torx/s_klyuch-g-obraznyy-6-grannyy-19mm
130	зубило ручные 16мм	zubilo-ruchnye-16mm	137	\N	2025-11-02 10:54:58.281	2025-11-02 10:55:52.924	{"RockForce":{"displayName":"Зубило с шестигранным основанием 16мм (L-175мм),на пластиковом держателе","imagePath":"/media/products/105/RF-60316175.webp","productCode":"RF-60316175","updatedAt":"2025-11-02T10:55:52.923Z"}}	structure / metalloobrabotka / zubilo / zubilo-ruchnye-16mm	structure/d_metalloobrabotka/d_zubilo/s_zubilo-ruchnye-16mm
131	3/4-1/2 ударный переходник	3-4-1-2-udarnyy-perehodnik	138	\N	2025-11-02 10:59:55.392	2025-11-02 11:01:20.682	{"Дело техники":{"displayName":"Переходник ударный 3/4\\"F × 1/2\\"M","imagePath":"/media/products/106/669 450.webp","productCode":"669 450","updatedAt":"2025-11-02T11:01:20.681Z"}}	structure / ruchnoy-instrument / adaptery-perehodniki / udarnye-adaptery / 3-4-1-2-udarnyy-perehodnik	structure/d_ruchnoy-instrument/d_adaptery-perehodniki/d_udarnye-adaptery/s_3-4-1-2-udarnyy-perehodnik
132	Подставка 3т (h 285мм, h 420мм) (к-т 2шт.)	podstavka-3t-h-285mm-h-420mm-k-t-2sht	140	\N	2025-11-02 11:22:50.399	2025-11-02 11:23:34.907	{"Forsage":{"displayName":"Подставка ремонтная 3т (h min 285мм, h max 420мм) (к-т 2шт.)","imagePath":"/media/products/108/F-T43001C ST.webp","productCode":"F-T43001C ST","updatedAt":"2025-11-02T11:23:34.906Z"}}	structure / pod-emnoe / podstavki-2-3t / podstavka-3t-h-285mm-h-420mm-k-t-2sht	structure/d_pod-emnoe/d_podstavki-2-3t/s_podstavka-3t-h-285mm-h-420mm-k-t-2sht
133	адаптер 1/2 на 3/8	adapter-1-2-na-3-8	127	\N	2025-11-02 11:30:44.762	2025-11-02 11:32:21.13	{"TOPTUL":{"displayName":"Переходник 1/2\\"(F)х3/8(М) TOPTUL","imagePath":"/media/products/109/CAEA1612.webp","productCode":"CAEA1612","updatedAt":"2025-11-02T11:32:21.129Z"}}	structure / ruchnoy-instrument / adaptery-perehodniki / perehodnik-1-2 / adapter-1-2-na-3-8	structure/d_ruchnoy-instrument/d_adaptery-perehodniki/d_perehodnik-1-2/s_adapter-1-2-na-3-8
134	torx t60	torx-t60	13	\N	2025-11-02 11:35:40.416	2025-11-02 11:36:35.314	{"TOPTUL":{"displayName":"Головка 1/2\\" с насадкой TORX T60 TOPTUL","imagePath":"/media/products/110/BCFA1660.webp","productCode":"BCFA1660","updatedAt":"2025-11-02T11:36:35.312Z"}}	structure / bity / 1-2-zapressovannye / torx-t60	structure/d_bity/d_1-2-zapressovannye/s_torx-t60
135	MUBEA - ЩИПЦЫ САМОЗАЖИМНЫХ ХОМУТОВ	mubea-schiptsy-samozazhimnyh-homutov	144	\N	2025-11-02 11:52:59.208	2025-11-02 11:53:44.573	{"ARNEZI":{"displayName":"Клещи для самозажимных хомутов MUBEA ARNEZI","imagePath":"/media/products/111/R7703502.webp","productCode":"R7703502","updatedAt":"2025-11-02T11:53:44.572Z"}}	structure / sharnirno-gubtsevyy-instrument / samozazhimnyh-homutov / mubea-schiptsy-samozazhimnyh-homutov	structure/d_sharnirno-gubtsevyy-instrument/d_samozazhimnyh-homutov/s_mubea-schiptsy-samozazhimnyh-homutov
137	шприцы для литола 600мл	shpritsy-dlya-litola-600ml	146	\N	2025-11-03 08:58:45.774	2025-11-03 08:58:45.774	\N	structure / oborudovanie / shpritsy / shpritsy-litol / shpritsy-dlya-litola-600ml	structure/d_oborudovanie/d_shpritsy/d_shpritsy-litol/s_shpritsy-dlya-litola-600ml
138	шприцы для литола пневмо	shpritsy-dlya-litola-pnevmo	146	\N	2025-11-03 08:59:00.445	2025-11-03 08:59:00.445	\N	structure / oborudovanie / shpritsy / shpritsy-litol / shpritsy-dlya-litola-pnevmo	structure/d_oborudovanie/d_shpritsy/d_shpritsy-litol/s_shpritsy-dlya-litola-pnevmo
136	шприц для литола 400мм	shprits-dlya-litola-400mm	146	\N	2025-11-03 08:58:33.769	2025-11-03 08:59:53.582	{"STARTUL":{"displayName":"Шприц автомобильный для смазки 400мл PRO STARTUL (PRO-6065) (рычажно-плунжерный, с гибким шлангом и стальной трубкой)","imagePath":"/media/products/112/PRO-6065.webp","productCode":"PRO-6065","updatedAt":"2025-11-03T08:59:53.581Z"}}	structure / oborudovanie / shpritsy / shpritsy-litol / shprits-dlya-litola-400mm	structure/d_oborudovanie/d_shpritsy/d_shpritsy-litol/s_shprits-dlya-litola-400mm
139	ударно-поворотная отвертка с 6 битами	udarno-povorotnaya-otvertka-s-6-bitami	149	\N	2025-11-03 09:04:56.46	2025-11-03 09:05:42.583	{"Дело техники":{"displayName":"Отвёртка ударная со вставками 5/16\\"","imagePath":"/media/products/113/766906.webp","productCode":"766906","updatedAt":"2025-11-03T09:05:42.582Z"}}	structure / ruchnoy-instrument / otvertki / udarno-povorotnye-otvertki / udarno-povorotnaya-otvertka-s-6-bitami	structure/d_ruchnoy-instrument/d_otvertki/d_udarno-povorotnye-otvertki/s_udarno-povorotnaya-otvertka-s-6-bitami
141	Вороток U 600мм	vorotok-u-600mm	156	\N	2025-11-03 09:12:23.829	2025-11-03 09:12:23.829	\N	structure / ruchnoy-instrument / vorotki-sharnirnye / sharnirnyy-1-2 / vorotok-u-600mm	structure/d_ruchnoy-instrument/d_vorotki-sharnirnye/d_sharnirnyy-1-2/s_vorotok-u-600mm
140	Вопроток U 750мм	voprotok-u-750mm	156	\N	2025-11-03 09:12:12.254	2025-11-03 09:13:18.996	{"RockForce":{"displayName":"Вороток шарнирный 750мм 1/2''","imagePath":"/media/products/114/RF-8014750U.webp","productCode":"RF-8014750U","updatedAt":"2025-11-03T09:13:18.994Z"}}	structure / ruchnoy-instrument / vorotki-sharnirnye / sharnirnyy-1-2 / voprotok-u-750mm	structure/d_ruchnoy-instrument/d_vorotki-sharnirnye/d_sharnirnyy-1-2/s_voprotok-u-750mm
142	головка 46мм 12гр	golovka-46mm-12gr	40	\N	2025-11-03 09:19:18.134	2025-11-03 09:20:08.527	{"FORCEKRAFT":{"displayName":"Головка 46мм (12гр.), 3/4''","imagePath":"/media/products/116/FK-56946.webp","productCode":"FK-56946","updatedAt":"2025-11-03T09:20:08.526Z"}}	structure / ruchnoy-instrument / golovki-tortsevye / 3-4-korotkie / golovka-46mm-12gr	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_3-4-korotkie/s_golovka-46mm-12gr
143	сжим прямые 175	szhim-pryamye-175	159	\N	2025-11-03 09:24:07.422	2025-11-03 09:24:07.422	\N	structure / ruchnoy-instrument / stopornye-kol-tsa / poshtuchno-175mm / szhim-pryamye-175	structure/d_ruchnoy-instrument/d_stopornye-kol-tsa/d_poshtuchno-175mm/s_szhim-pryamye-175
144	разжим прямые 175	razzhim-pryamye-175	159	\N	2025-11-03 09:24:17.2	2025-11-03 09:24:17.2	\N	structure / ruchnoy-instrument / stopornye-kol-tsa / poshtuchno-175mm / razzhim-pryamye-175	structure/d_ruchnoy-instrument/d_stopornye-kol-tsa/d_poshtuchno-175mm/s_razzhim-pryamye-175
\.


--
-- Data for Name: stock_traffic_lights; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_traffic_lights (id, "productCode", "brandName", "minStock", "normalStock", "goodStock", "weeklySales", "categoryId", "createdAt", "updatedAt") FROM stdin;
30	622019	Дело техники	1	2	3	0	7	2025-10-28 08:09:42.197	2025-11-03 08:20:37.092
43	F-HB140	Forsage	1	2	3	0	95	2025-10-28 10:03:53.723	2025-11-03 08:20:37.107
44	44016	Автодело	1	2	3	0	95	2025-10-28 10:03:53.724	2025-11-03 08:20:37.108
66	80222	Force	1	2	3	0	108	2025-10-29 08:31:03.462	2025-11-03 08:20:37.133
68	ER13130	Эврика	1	2	3	0	117	2025-10-29 10:36:44.42	2025-11-03 08:20:37.134
78	Sch-TAP10x1,5	Scheppach	1	2	3	0	113	2025-10-29 10:36:44.431	2025-11-03 08:20:37.145
79	Sch-TAP9x1	Scheppach	1	2	3	0	113	2025-10-29 10:36:44.433	2025-11-03 08:20:37.147
80	Sch-TAP8x1,25	Scheppach	1	2	3	0	113	2025-10-29 10:36:44.434	2025-11-03 08:20:37.148
31	JCB-41082-5	JCB	1	2	3	0	81	2025-10-28 08:09:42.199	2025-11-03 08:20:37.093
32	F-5161MP	Forsage	1	2	3	0	75	2025-10-28 08:09:42.2	2025-11-03 08:20:37.094
69	Sch-TAP14x1.5	Scheppach	1	2	3	0	113	2025-10-29 10:36:44.421	2025-11-03 08:20:37.135
81	FK-46510027	FORCEKRAFT	1	2	3	0	41	2025-10-29 10:36:44.435	2025-11-03 08:20:37.149
84	JCB-75510	JCB	1	2	3	0	97	2025-11-02 12:13:20.891	2025-11-03 08:20:37.151
18	BAEA1617	TOPTUL	1	2	3	0	9	2025-10-28 08:09:42.181	2025-11-03 08:20:37.078
33	rf802222	RockForce	1	2	3	0	71	2025-10-28 08:09:42.201	2025-11-03 08:20:37.095
54	539 210	Дело техники	1	2	3	0	99	2025-10-28 12:54:59.3	2025-11-03 08:20:37.119
55	539 240	Дело техники	1	2	3	0	99	2025-10-28 12:54:59.302	2025-11-03 08:20:37.121
70	SB31020	Stab	1	2	3	0	95	2025-10-29 10:36:44.422	2025-11-03 08:20:37.136
71	39775	Автодело	1	2	3	0	91	2025-10-29 10:36:44.423	2025-11-03 08:20:37.138
34	80634	Force	1	2	3	0	82	2025-10-28 08:09:42.203	2025-11-03 08:20:37.096
56	560 008	Дело техники	1	2	3	0	101	2025-10-28 12:54:59.303	2025-11-03 08:20:37.122
45	RF-807421	RockForce	1	2	3	0	88	2025-10-28 10:59:10.233	2025-11-03 08:20:37.109
47	FSEB1250	TOPTUL	1	2	3	0	17	2025-10-28 10:59:10.237	2025-11-03 08:20:37.11
57	560 010	Дело техники	1	2	3	0	101	2025-10-28 12:54:59.305	2025-11-03 08:20:37.123
59	R7300121	ARNEZI	1	2	3	0	104	2025-10-29 07:37:23.385	2025-11-03 08:20:37.124
60	R7300141	ARNEZI	1	2	3	0	104	2025-10-29 07:37:23.387	2025-11-03 08:20:37.125
58	1783007	Force	1	2	3	0	25	2025-10-29 06:19:28.347	2025-11-03 08:20:37.126
72	270055	Дело техники	1	2	3	0	95	2025-10-29 10:36:44.425	2025-11-03 08:20:37.139
73	1767545	Force	1	2	3	0	17	2025-10-29 10:36:44.426	2025-11-03 08:20:37.14
82	HZ 25.1.281W	Хорекс Авто	1	2	3	0	121	2025-10-29 11:20:08.921	2025-11-03 08:20:37.152
83	628 745	Дело техники	1	2	3	0	110	2025-10-29 11:20:08.922	2025-11-03 08:20:37.153
67	Sch-TAP8x1	Scheppach	1	2	3	0	113	2025-10-29 10:36:44.363	2025-11-03 08:20:37.079
19	825206	Дело техники	1	2	3	0	53	2025-10-28 08:09:42.182	2025-11-03 08:20:37.08
20	rf52508	RockForce	1	2	3	0	36	2025-10-28 08:09:42.184	2025-11-03 08:20:37.081
21	JCB-4458510	JCB	1	2	3	0	50	2025-10-28 08:09:42.185	2025-11-03 08:20:37.082
22	RF-1767555 Premium	RockForce	1	2	3	0	17	2025-10-28 08:09:42.186	2025-11-03 08:20:37.083
48	RF-1767545 Premium	RockForce	1	2	3	0	17	2025-10-28 10:59:10.238	2025-11-03 08:20:37.111
61	R7300382	ARNEZI	1	2	3	0	104	2025-10-29 07:37:23.389	2025-11-03 08:20:37.127
23	FK-905M11	FORCEKRAFT	1	2	3	0	54	2025-10-28 08:09:42.188	2025-11-03 08:20:37.084
24	JCB-4167-5MPB	JCB	1	2	3	0	56	2025-10-28 08:09:42.189	2025-11-03 08:20:37.085
74	ER01010M	Эврика	1	2	3	0	113	2025-10-29 10:36:44.427	2025-11-03 08:20:37.141
75	RF-9T0801	RockForce	1	2	3	0	118	2025-10-29 10:36:44.428	2025-11-03 08:20:37.142
76	608 745	Дело техники	1	2	3	0	108	2025-10-29 10:36:44.429	2025-11-03 08:20:37.143
77	Sch-TAP12x1.75	Scheppach	1	2	3	0	113	2025-10-29 10:36:44.43	2025-11-03 08:20:37.144
25	KACN160B	TOPTUL	1	2	3	0	66	2025-10-28 08:09:42.19	2025-11-03 08:20:37.086
36	660019	Дело техники	1	2	3	0	85	2025-10-28 08:09:42.205	2025-11-03 08:20:37.099
46	FSEB1245	TOPTUL	1	2	3	0	17	2025-10-28 10:59:10.235	2025-11-03 08:20:37.113
49	1767530	Force	1	2	3	0	17	2025-10-28 10:59:10.239	2025-11-03 08:20:37.114
52	F-75532	Forsage	1	2	3	0	97	2025-10-28 12:54:59.297	2025-11-03 08:20:37.117
50	GAAV0703	TOPTUL	1	2	3	0	96	2025-10-28 10:59:10.241	2025-11-03 08:20:37.115
51	FSEA1245	TOPTUL	1	2	3	0	20	2025-10-28 12:54:59.296	2025-11-03 08:20:37.116
39	ST5025	STARTUL	1	2	3	0	95	2025-10-28 10:03:53.717	2025-11-03 08:20:37.101
37	ABG-20	Eco	1	2	3	0	87	2025-10-28 08:09:42.207	2025-11-03 08:20:37.1
38	YT-38510	Yato	1	2	3	0	88	2025-10-28 10:03:53.716	2025-11-03 08:20:37.102
40	ER-53825	Эврика	1	2	3	0	91	2025-10-28 10:03:53.719	2025-11-03 08:20:37.104
41	F-340122113	Forsage	1	2	3	0	95	2025-10-28 10:03:53.72	2025-11-03 08:20:37.105
53	539 230	Дело техники	1	2	3	0	99	2025-10-28 12:54:59.299	2025-11-03 08:20:37.118
62	HZ 27.1.047W	Хорекс Авто	1	2	3	0	104	2025-10-29 08:31:03.456	2025-11-03 08:20:37.128
63	CHAG0813	TOPTUL	1	2	3	0	108	2025-10-29 08:31:03.457	2025-11-03 08:20:37.129
64	BM-802222	Baum	1	2	3	0	71	2025-10-29 08:31:03.459	2025-11-03 08:20:37.131
65	CJBG0815	TOPTUL	1	2	3	0	108	2025-10-29 08:31:03.46	2025-11-03 08:20:37.132
26	800 410	Дело техники	1	2	3	0	61	2025-10-28 08:09:42.192	2025-11-03 08:20:37.088
27	jcb52510	JCB	1	2	3	0	36	2025-10-28 08:09:42.193	2025-11-03 08:20:37.089
29	40290	Автодело	1	2	3	0	69	2025-10-28 08:09:42.196	2025-11-03 08:20:37.09
28	FK-933T1-12P	FORCEKRAFT	1	2	3	0	65	2025-10-28 08:09:42.194	2025-11-03 08:20:37.091
42	RF-HB140	RockForce	1	2	3	0	95	2025-10-28 10:03:53.721	2025-11-03 08:20:37.106
17	321322	Force	1	2	3	0	48	2025-10-28 08:09:42.179	2025-11-03 08:20:37.077
35	FK-44836	FORCEKRAFT	1	2	3	0	86	2025-10-28 08:09:42.204	2025-11-03 08:20:37.098
87	RF-8143	RockForce	1	2	3	0	122	2025-11-02 12:13:20.897	2025-11-03 08:20:37.156
5	FSEB1240	TOPTUL	1	2	3	0	17	2025-10-28 08:09:42.162	2025-11-03 08:20:37.062
6	1763040	Force	1	2	3	0	20	2025-10-28 08:09:42.164	2025-11-03 08:20:37.064
9	63005B	Force	1	2	3	0	47	2025-10-28 08:09:42.168	2025-11-03 08:20:37.067
10	622017	Дело техники	1	2	3	0	7	2025-10-28 08:09:42.169	2025-11-03 08:20:37.068
12	620 017	Дело техники	1	2	3	0	9	2025-10-28 08:09:42.172	2025-11-03 08:20:37.07
11	R7401001	ARNEZI	1	2	3	0	29	2025-10-28 08:09:42.171	2025-11-03 08:20:37.071
13	54917	Force	1	2	3	0	7	2025-10-28 08:09:42.174	2025-11-03 08:20:37.072
14	YT0590	Yato	1	2	3	0	47	2025-10-28 08:09:42.175	2025-11-03 08:20:37.073
15	54517	Force	1	2	3	0	9	2025-10-28 08:09:42.176	2025-11-03 08:20:37.074
16	32332065	Force	1	2	3	0	48	2025-10-28 08:09:42.178	2025-11-03 08:20:37.076
8	ST4581	STARTUL	1	2	3	0	32	2025-10-28 08:09:42.166	2025-11-03 08:20:37.066
7	BAEB1617	TOPTUL	1	2	3	0	7	2025-10-28 08:09:42.165	2025-11-03 08:20:37.065
85	R7300381	ARNEZI	1	2	3	0	104	2025-11-02 12:13:20.895	2025-11-03 08:20:37.154
86	JCB-75508	JCB	1	2	3	0	97	2025-11-02 12:13:20.896	2025-11-03 08:20:37.155
3	SG-35C14	Eco	1	2	3	0	3	2025-10-28 08:09:42.159	2025-11-03 08:20:37.059
4	622021	Дело техники	1	2	3	0	7	2025-10-28 08:09:42.161	2025-11-03 08:20:37.061
101	JCB-76418	JCB	1	2	3	0	136	2025-11-02 12:13:20.912	2025-11-03 08:20:37.171
102	RF-60316175	RockForce	1	2	3	0	137	2025-11-02 12:13:20.913	2025-11-03 08:20:37.172
103	669 450	Дело техники	1	2	3	0	138	2025-11-02 12:13:20.914	2025-11-03 08:20:37.173
104	F-8156450MPB	Forsage	1	2	3	0	93	2025-11-02 12:13:20.915	2025-11-03 08:20:37.174
105	F-T43001C ST	Forsage	1	2	3	0	140	2025-11-02 12:13:20.916	2025-11-03 08:20:37.176
106	CAEA1612	TOPTUL	1	2	3	0	127	2025-11-02 12:13:20.917	2025-11-03 08:20:37.177
107	BCFA1660	TOPTUL	1	2	3	0	13	2025-11-02 12:13:20.918	2025-11-03 08:20:37.178
108	R7703502	ARNEZI	1	2	3	0	144	2025-11-02 12:13:20.919	2025-11-03 08:20:37.179
1	1767540	Force	1	2	3	0	17	2025-10-28 08:09:42.147	2025-11-03 08:20:37.047
2	CAEA1208	TOPTUL	1	2	3	0	19	2025-10-28 08:09:42.158	2025-11-03 08:20:37.057
88	608815	Дело техники	1	2	3	0	122	2025-11-02 12:13:20.898	2025-11-03 08:20:37.157
89	600 057	Дело техники	1	2	3	0	36	2025-11-02 12:13:20.899	2025-11-03 08:20:37.159
90	BAEA0807	TOPTUL	1	2	3	0	36	2025-11-02 12:13:20.9	2025-11-03 08:20:37.16
91	603 008	Дело техники	1	2	3	0	130	2025-11-02 12:13:20.901	2025-11-03 08:20:37.161
92	KAJA18C1	TOPTUL	1	2	3	0	124	2025-11-02 12:13:20.903	2025-11-03 08:20:37.162
93	80942	Force	1	2	3	0	127	2025-11-02 12:13:20.904	2025-11-03 08:20:37.163
94	839 816	Дело техники	1	2	3	0	133	2025-11-02 12:13:20.905	2025-11-03 08:20:37.164
95	839 822	Дело техники	1	2	3	0	133	2025-11-02 12:13:20.906	2025-11-03 08:20:37.165
96	40574	Автодело	1	2	3	0	135	2025-11-02 12:13:20.907	2025-11-03 08:20:37.166
97	JCB-76417	JCB	1	2	3	0	136	2025-11-02 12:13:20.908	2025-11-03 08:20:37.167
98	JCB-76419	JCB	1	2	3	0	136	2025-11-02 12:13:20.909	2025-11-03 08:20:37.168
99	JCB-76413	JCB	1	2	3	0	136	2025-11-02 12:13:20.91	2025-11-03 08:20:37.169
100	JCB-76416	JCB	1	2	3	0	136	2025-11-02 12:13:20.911	2025-11-03 08:20:37.17
\.


--
-- Data for Name: suppliers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.suppliers (id, name) FROM stdin;
1	TT
2	Armtek
3	Форсаж
4	STM
5	Гамматест
\.


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 1, false);


--
-- Name: brands_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.brands_id_seq', 18, true);


--
-- Name: cash_days_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cash_days_id_seq', 10, true);


--
-- Name: cash_events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cash_events_id_seq', 88, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 159, true);


--
-- Name: customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customers_id_seq', 1, false);


--
-- Name: disassembly_scenarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.disassembly_scenarios_id_seq', 1, false);


--
-- Name: inventory_forecasts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventory_forecasts_id_seq', 1, false);


--
-- Name: inventory_snapshots_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventory_snapshots_id_seq', 1180, true);


--
-- Name: product_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_images_id_seq', 106, true);


--
-- Name: product_sales_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_sales_history_id_seq', 1, false);


--
-- Name: product_unit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_unit_logs_id_seq', 1887, true);


--
-- Name: product_units_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_units_id_seq', 519, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 117, true);


--
-- Name: reorder_points_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reorder_points_id_seq', 1, false);


--
-- Name: spines_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.spines_id_seq', 146, true);


--
-- Name: stock_traffic_lights_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stock_traffic_lights_id_seq', 108, true);


--
-- Name: suppliers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.suppliers_id_seq', 5, true);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: brands brands_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_pkey PRIMARY KEY (id);


--
-- Name: cash_days cash_days_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cash_days
    ADD CONSTRAINT cash_days_pkey PRIMARY KEY (id);


--
-- Name: cash_events cash_events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cash_events
    ADD CONSTRAINT cash_events_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- Name: disassembly_scenarios disassembly_scenarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.disassembly_scenarios
    ADD CONSTRAINT disassembly_scenarios_pkey PRIMARY KEY (id);


--
-- Name: inventory_forecasts inventory_forecasts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_forecasts
    ADD CONSTRAINT inventory_forecasts_pkey PRIMARY KEY (id);


--
-- Name: inventory_snapshots inventory_snapshots_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_snapshots
    ADD CONSTRAINT inventory_snapshots_pkey PRIMARY KEY (id);


--
-- Name: product_images product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);


--
-- Name: product_sales_history product_sales_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_sales_history
    ADD CONSTRAINT product_sales_history_pkey PRIMARY KEY (id);


--
-- Name: product_unit_logs product_unit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_unit_logs
    ADD CONSTRAINT product_unit_logs_pkey PRIMARY KEY (id);


--
-- Name: product_units product_units_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_units
    ADD CONSTRAINT product_units_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: reorder_points reorder_points_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reorder_points
    ADD CONSTRAINT reorder_points_pkey PRIMARY KEY (id);


--
-- Name: spines spines_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.spines
    ADD CONSTRAINT spines_pkey PRIMARY KEY (id);


--
-- Name: stock_traffic_lights stock_traffic_lights_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_traffic_lights
    ADD CONSTRAINT stock_traffic_lights_pkey PRIMARY KEY (id);


--
-- Name: suppliers suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (id);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: brands_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX brands_name_key ON public.brands USING btree (name);


--
-- Name: brands_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX brands_slug_key ON public.brands USING btree (slug);


--
-- Name: cash_days_date_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX cash_days_date_key ON public.cash_days USING btree (date);


--
-- Name: categories_node_index_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX categories_node_index_idx ON public.categories USING btree (node_index);


--
-- Name: categories_node_index_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX categories_node_index_key ON public.categories USING btree (node_index);


--
-- Name: categories_parent_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX categories_parent_id_idx ON public.categories USING btree (parent_id);


--
-- Name: categories_path_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX categories_path_idx ON public.categories USING btree (path);


--
-- Name: categories_path_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX categories_path_key ON public.categories USING btree (path);


--
-- Name: categories_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX categories_slug_key ON public.categories USING btree (slug);


--
-- Name: disassembly_scenarios_parentProductCode_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "disassembly_scenarios_parentProductCode_name_key" ON public.disassembly_scenarios USING btree ("parentProductCode", name);


--
-- Name: inventory_forecasts_productUnitId_periodStart_periodType_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "inventory_forecasts_productUnitId_periodStart_periodType_key" ON public.inventory_forecasts USING btree ("productUnitId", "periodStart", "periodType");


--
-- Name: inventory_snapshots_snapshotDate_productUnitId_periodType_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "inventory_snapshots_snapshotDate_productUnitId_periodType_key" ON public.inventory_snapshots USING btree ("snapshotDate", "productUnitId", "periodType");


--
-- Name: product_sales_history_productUnitId_cashEventId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "product_sales_history_productUnitId_cashEventId_key" ON public.product_sales_history USING btree ("productUnitId", "cashEventId");


--
-- Name: product_units_serial_number_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX product_units_serial_number_key ON public.product_units USING btree (serial_number);


--
-- Name: products_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX products_code_key ON public.products USING btree (code);


--
-- Name: products_node_index_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX products_node_index_idx ON public.products USING btree (node_index);


--
-- Name: products_node_index_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX products_node_index_key ON public.products USING btree (node_index);


--
-- Name: reorder_points_productUnitId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "reorder_points_productUnitId_key" ON public.reorder_points USING btree ("productUnitId");


--
-- Name: spines_node_index_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX spines_node_index_idx ON public.spines USING btree (node_index);


--
-- Name: spines_node_index_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX spines_node_index_key ON public.spines USING btree (node_index);


--
-- Name: spines_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX spines_slug_key ON public.spines USING btree (slug);


--
-- Name: stock_traffic_lights_productCode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "stock_traffic_lights_productCode_key" ON public.stock_traffic_lights USING btree ("productCode");


--
-- Name: suppliers_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX suppliers_name_key ON public.suppliers USING btree (name);


--
-- Name: cash_events cash_events_cash_day_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cash_events
    ADD CONSTRAINT cash_events_cash_day_id_fkey FOREIGN KEY (cash_day_id) REFERENCES public.cash_days(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cash_events cash_events_product_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cash_events
    ADD CONSTRAINT cash_events_product_unit_id_fkey FOREIGN KEY (product_unit_id) REFERENCES public.product_units(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: categories categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: inventory_forecasts inventory_forecasts_productUnitId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_forecasts
    ADD CONSTRAINT "inventory_forecasts_productUnitId_fkey" FOREIGN KEY ("productUnitId") REFERENCES public.product_units(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: inventory_snapshots inventory_snapshots_productUnitId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_snapshots
    ADD CONSTRAINT "inventory_snapshots_productUnitId_fkey" FOREIGN KEY ("productUnitId") REFERENCES public.product_units(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: product_images product_images_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT "product_images_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_sales_history product_sales_history_cashEventId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_sales_history
    ADD CONSTRAINT "product_sales_history_cashEventId_fkey" FOREIGN KEY ("cashEventId") REFERENCES public.cash_events(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: product_sales_history product_sales_history_productUnitId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_sales_history
    ADD CONSTRAINT "product_sales_history_productUnitId_fkey" FOREIGN KEY ("productUnitId") REFERENCES public.product_units(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: product_unit_logs product_unit_logs_productUnitId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_unit_logs
    ADD CONSTRAINT "product_unit_logs_productUnitId_fkey" FOREIGN KEY ("productUnitId") REFERENCES public.product_units(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_units product_units_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_units
    ADD CONSTRAINT "product_units_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public.customers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: product_units product_units_disassembledParentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_units
    ADD CONSTRAINT "product_units_disassembledParentId_fkey" FOREIGN KEY ("disassembledParentId") REFERENCES public.product_units(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: product_units product_units_disassemblyScenarioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_units
    ADD CONSTRAINT "product_units_disassemblyScenarioId_fkey" FOREIGN KEY ("disassemblyScenarioId") REFERENCES public.disassembly_scenarios(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: product_units product_units_parentProductUnitId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_units
    ADD CONSTRAINT "product_units_parentProductUnitId_fkey" FOREIGN KEY ("parentProductUnitId") REFERENCES public.product_units(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: product_units product_units_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_units
    ADD CONSTRAINT "product_units_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_units product_units_spineId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_units
    ADD CONSTRAINT "product_units_spineId_fkey" FOREIGN KEY ("spineId") REFERENCES public.spines(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: product_units product_units_supplierId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_units
    ADD CONSTRAINT "product_units_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES public.suppliers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: products products_brandId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "products_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES public.brands(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: products products_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: products products_spineId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "products_spineId_fkey" FOREIGN KEY ("spineId") REFERENCES public.spines(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: reorder_points reorder_points_productUnitId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reorder_points
    ADD CONSTRAINT "reorder_points_productUnitId_fkey" FOREIGN KEY ("productUnitId") REFERENCES public.product_units(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: spines spines_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.spines
    ADD CONSTRAINT "spines_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: stock_traffic_lights stock_traffic_lights_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_traffic_lights
    ADD CONSTRAINT "stock_traffic_lights_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

