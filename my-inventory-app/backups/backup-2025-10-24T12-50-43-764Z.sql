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
    "brandId" integer,
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
\.


--
-- Data for Name: brands; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.brands (id, name, slug, "createdAt", "updatedAt") FROM stdin;
1	Eco	eco	2025-10-24 12:29:41.622	2025-10-24 12:29:41.622
2	Дело техники	delo-tehniki	2025-10-24 12:38:51.552	2025-10-24 12:38:51.552
\.


--
-- Data for Name: cash_days; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cash_days (id, date, is_closed, total, created_at, updated_at) FROM stdin;
1	2025-10-23 21:00:00	t	41	2025-10-24 12:31:39.269	2025-10-24 12:46:23.492
\.


--
-- Data for Name: cash_events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cash_events (id, type, amount, notes, cash_day_id, product_unit_id, created_at) FROM stdin;
1	SALE	35	Продажа: Пистолет для антикоррозионных покрытий SG-35C14 ECO со шлангом	1	1	2025-10-24 12:31:56.11
2	SALE	6	Продажа: Головка двенадцатигранная 21 мм 1/2"	1	3	2025-10-24 12:41:07.512
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
\.


--
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_images (id, "productId", filename, path, "isMain", "createdAt", "githubUrl", "localPath", "storageType") FROM stdin;
1	1	SG-35C14.webp	/media/products/1/SG-35C14.webp	t	2025-10-24 12:29:56.578	\N	/media/products/1/SG-35C14.webp	local
2	2	622021.webp	/media/products/2/622021.webp	t	2025-10-24 12:39:02.364	https://raw.githubusercontent.com/poetrydeveloper/my-inventory-app_media/main/products/2/622021.webp	/media/products/2/622021.webp	github
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
\.


--
-- Data for Name: product_units; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_units (id, serial_number, "productId", sale_price, sold_at, created_at, updated_at, credit_paid_at, "isReturned", is_credit, "parentProductUnitId", product_category_id, product_category_name, product_code, product_description, product_name, product_tags, request_price_per_unit, returned_at, "statusCard", "statusProduct", created_at_candidate, created_at_request, "customerId", quantity_in_candidate, quantity_in_request, "supplierId", "spineId", "disassembledParentId", "disassemblyStatus", "isParsingAlgorithm", "disassemblyScenarioId") FROM stdin;
7	SG-35C14-20251024-153114960-841163/child-2-1761309888114-l9f85q7c3	1	\N	\N	2025-10-24 12:44:48.115	2025-10-24 12:45:18.865	\N	f	f	2	3	Пистолет для гравитекса	SG-35C14		Пистолет для антикоррозионных покрытий SG-35C14 ECO со шлангом	null	27.49	\N	ARRIVED	IN_STORE	\N	2025-10-24 12:44:48.114	\N	0	0	\N	1	\N	MONOLITH	f	\N
1	SG-35C14-20251024-153032140-515202	1	35	2025-10-24 12:31:56.104	2025-10-24 12:30:32.142	2025-10-24 12:31:56.105	\N	f	f	\N	3	Пистолет для гравитекса	SG-35C14		Пистолет для антикоррозионных покрытий SG-35C14 ECO со шлангом	null	27.49	\N	ARRIVED	SOLD	2025-10-24 12:30:41.904	2025-10-24 12:31:14.972	\N	1	0	\N	1	\N	MONOLITH	f	\N
4	622021-20251024-154041595-882958	2	\N	\N	2025-10-24 12:40:41.596	2025-10-24 12:40:41.596	\N	f	f	\N	7	12-граней	622021		Головка двенадцатигранная 21 мм 1/2"	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	2	\N	MONOLITH	f	\N
3	622021-20251024-153909716-735277	2	6	2025-10-24 12:41:07.507	2025-10-24 12:39:09.717	2025-10-24 12:41:07.508	\N	f	f	\N	7	12-граней	622021		Головка двенадцатигранная 21 мм 1/2"	null	3.18	\N	ARRIVED	SOLD	2025-10-24 12:39:23.955	2025-10-24 12:40:41.608	\N	1	0	\N	2	\N	MONOLITH	f	\N
5	SG-35C14-20251024-154448093-201531	1	\N	\N	2025-10-24 12:44:48.095	2025-10-24 12:44:48.095	\N	f	f	\N	3	Пистолет для гравитекса	SG-35C14		Пистолет для антикоррозионных покрытий SG-35C14 ECO со шлангом	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	1	\N	MONOLITH	f	\N
2	SG-35C14-20251024-153114960-841163	1	\N	\N	2025-10-24 12:31:14.961	2025-10-24 12:44:48.109	\N	f	f	\N	3	Пистолет для гравитекса	SG-35C14		Пистолет для антикоррозионных покрытий SG-35C14 ECO со шлангом	null	\N	\N	SPROUTED	\N	2025-10-24 12:44:26.344	\N	\N	1	0	\N	1	\N	MONOLITH	f	\N
6	SG-35C14-20251024-153114960-841163/child-1-1761309888111-78p2gdzgu	1	\N	\N	2025-10-24 12:44:48.112	2025-10-24 12:45:15.477	\N	f	f	2	3	Пистолет для гравитекса	SG-35C14		Пистолет для антикоррозионных покрытий SG-35C14 ECO со шлангом	null	27.49	\N	ARRIVED	IN_STORE	\N	2025-10-24 12:44:48.111	\N	0	0	\N	1	\N	MONOLITH	f	\N
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, code, name, description, "categoryId", "createdAt", "updatedAt", "brandId", "spineId", human_path, node_index) FROM stdin;
1	SG-35C14	Пистолет для антикоррозионных покрытий SG-35C14 ECO со шлангом		3	2025-10-24 12:29:55.739	2025-10-24 12:29:55.739	1	1	structure / pnevmatika / instrument / pistolet-dlya-graviteksa / pistolet-pod-graviteksa / sg-35c14	structure/d_pnevmatika/d_instrument/d_pistolet-dlya-graviteksa/s_pistolet-pod-graviteksa/p_sg-35c14
2	622021	Головка двенадцатигранная 21 мм 1/2"		7	2025-10-24 12:39:01.165	2025-10-24 12:39:01.165	2	2	structure / ruchnoy-instrument / golovki-tortsevye / 1-2-korotkie / 12-graney / golovka-21mm-12gr / 622021	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-2-korotkie/d_12-graney/s_golovka-21mm-12gr/p_622021
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
\.


--
-- Data for Name: suppliers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.suppliers (id, name) FROM stdin;
1	TT
2	Armtek
\.


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 1, false);


--
-- Name: brands_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.brands_id_seq', 2, true);


--
-- Name: cash_days_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cash_days_id_seq', 1, true);


--
-- Name: cash_events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cash_events_id_seq', 2, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 9, true);


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

SELECT pg_catalog.setval('public.inventory_snapshots_id_seq', 3, true);


--
-- Name: product_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_images_id_seq', 2, true);


--
-- Name: product_sales_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_sales_history_id_seq', 1, false);


--
-- Name: product_unit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_unit_logs_id_seq', 27, true);


--
-- Name: product_units_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_units_id_seq', 7, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 2, true);


--
-- Name: reorder_points_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reorder_points_id_seq', 1, false);


--
-- Name: spines_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.spines_id_seq', 2, true);


--
-- Name: suppliers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.suppliers_id_seq', 2, true);


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
    ADD CONSTRAINT "product_images_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE RESTRICT;


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
    ADD CONSTRAINT "products_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES public.brands(id) ON UPDATE CASCADE ON DELETE SET NULL;


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
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

