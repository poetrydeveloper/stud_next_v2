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
2e70d6c0-13d3-4d2e-a765-7850b3db07dc	7e1d31d63fb1be967e974c57ee76e4bcb5a698257e6a967bb0006cfebbe072d3	2025-10-25 10:02:55.102461+03	20251025070255_1	\N	\N	2025-10-25 10:02:55.096797+03	1
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
\.


--
-- Data for Name: cash_days; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cash_days (id, date, is_closed, total, created_at, updated_at) FROM stdin;
1	2025-10-23 21:00:00	t	41	2025-10-24 12:31:39.269	2025-10-24 12:46:23.492
2	2025-10-24 21:00:00	t	372	2025-10-25 06:31:20.19	2025-10-25 13:03:33.862
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
\.


--
-- Data for Name: product_units; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_units (id, serial_number, "productId", sale_price, sold_at, created_at, updated_at, credit_paid_at, "isReturned", is_credit, "parentProductUnitId", product_category_id, product_category_name, product_code, product_description, product_name, product_tags, request_price_per_unit, returned_at, "statusCard", "statusProduct", created_at_candidate, created_at_request, "customerId", quantity_in_candidate, quantity_in_request, "supplierId", "spineId", "disassembledParentId", "disassemblyStatus", "isParsingAlgorithm", "disassemblyScenarioId") FROM stdin;
10	1767540-20251025-094536358-287384/child-1-1761374974952-wllsj3hq9	3	\N	\N	2025-10-25 06:49:34.954	2025-10-25 06:49:53.737	\N	f	f	8	17	Torx_17675	1767540		Бита Torx T40 10 мм. FORCE 1767540	null	3.06	\N	ARRIVED	IN_STORE	\N	2025-10-25 06:49:34.953	\N	0	0	\N	3	\N	MONOLITH	f	\N
17	CAEA1208-20251025-095532805-643593	4	\N	\N	2025-10-25 06:55:32.806	2025-10-25 06:55:32.806	\N	f	f	\N	19	Переходник 3/8	CAEA1208		Переходник 3/8"(F)х1/4(М) TOPTUL	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	4	\N	MONOLITH	f	\N
7	SG-35C14-20251024-153114960-841163/child-2-1761309888114-l9f85q7c3	1	\N	\N	2025-10-24 12:44:48.115	2025-10-24 12:45:18.865	\N	f	f	2	3	Пистолет для гравитекса	SG-35C14		Пистолет для антикоррозионных покрытий SG-35C14 ECO со шлангом	null	27.49	\N	ARRIVED	IN_STORE	\N	2025-10-24 12:44:48.114	\N	0	0	\N	1	\N	MONOLITH	f	\N
16	CAEA1208-20251025-095419393-323579	4	\N	\N	2025-10-25 06:54:19.395	2025-10-25 06:55:32.812	\N	f	f	\N	19	Переходник 3/8	CAEA1208		Переходник 3/8"(F)х1/4(М) TOPTUL	null	\N	\N	SPROUTED	\N	2025-10-25 06:54:38.548	\N	\N	1	0	\N	4	\N	MONOLITH	f	\N
1	SG-35C14-20251024-153032140-515202	1	35	2025-10-24 12:31:56.104	2025-10-24 12:30:32.142	2025-10-24 12:31:56.105	\N	f	f	\N	3	Пистолет для гравитекса	SG-35C14		Пистолет для антикоррозионных покрытий SG-35C14 ECO со шлангом	null	27.49	\N	ARRIVED	SOLD	2025-10-24 12:30:41.904	2025-10-24 12:31:14.972	\N	1	0	\N	1	\N	MONOLITH	f	\N
9	1767540-20251025-094934933-947077	3	\N	\N	2025-10-25 06:49:34.935	2025-10-25 06:49:34.935	\N	f	f	\N	17	Torx_17675	1767540		Бита Torx T40 10 мм. FORCE 1767540	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	3	\N	MONOLITH	f	\N
8	1767540-20251025-094536358-287384	3	\N	\N	2025-10-25 06:45:36.36	2025-10-25 06:49:34.951	\N	f	f	\N	17	Torx_17675	1767540		Бита Torx T40 10 мм. FORCE 1767540	null	\N	\N	SPROUTED	\N	2025-10-25 06:45:54.099	\N	\N	1	0	\N	3	\N	MONOLITH	f	\N
3	622021-20251024-153909716-735277	2	6	2025-10-24 12:41:07.507	2025-10-24 12:39:09.717	2025-10-24 12:41:07.508	\N	f	f	\N	7	12-граней	622021		Головка двенадцатигранная 21 мм 1/2"	null	3.18	\N	ARRIVED	SOLD	2025-10-24 12:39:23.955	2025-10-24 12:40:41.608	\N	1	0	\N	2	\N	MONOLITH	f	\N
5	SG-35C14-20251024-154448093-201531	1	\N	\N	2025-10-24 12:44:48.095	2025-10-24 12:44:48.095	\N	f	f	\N	3	Пистолет для гравитекса	SG-35C14		Пистолет для антикоррозионных покрытий SG-35C14 ECO со шлангом	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	1	\N	MONOLITH	f	\N
2	SG-35C14-20251024-153114960-841163	1	\N	\N	2025-10-24 12:31:14.961	2025-10-24 12:44:48.109	\N	f	f	\N	3	Пистолет для гравитекса	SG-35C14		Пистолет для антикоррозионных покрытий SG-35C14 ECO со шлангом	null	\N	\N	SPROUTED	\N	2025-10-24 12:44:26.344	\N	\N	1	0	\N	1	\N	MONOLITH	f	\N
11	1767540-20251025-094536358-287384/child-2-1761374974957-mf1qsl4ag	3	\N	\N	2025-10-25 06:49:34.958	2025-10-25 06:49:54.373	\N	f	f	8	17	Torx_17675	1767540		Бита Torx T40 10 мм. FORCE 1767540	null	3.06	\N	ARRIVED	IN_STORE	\N	2025-10-25 06:49:34.957	\N	0	0	\N	3	\N	MONOLITH	f	\N
14	1767540-20251025-094536358-287384/child-5-1761374974967-j4a9b4yle	3	\N	\N	2025-10-25 06:49:34.969	2025-10-25 06:49:57.898	\N	f	f	8	17	Torx_17675	1767540		Бита Torx T40 10 мм. FORCE 1767540	null	3.06	\N	ARRIVED	IN_STORE	\N	2025-10-25 06:49:34.968	\N	0	0	\N	3	\N	MONOLITH	f	\N
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
34	R7401001-20251025-103413735-302508	7	\N	\N	2025-10-25 07:34:13.737	2025-10-25 07:34:13.737	\N	f	f	\N	29	ТАЗИКИ	R7401001		ARNEZI R7401001 Поддон для слива масла 8 л.	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	6	\N	MONOLITH	f	\N
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
97	825206-20251025-122055305-915811/child-4-1761384109050-0saudms0x	21	\N	\N	2025-10-25 09:21:49.051	2025-10-25 09:21:49.051	\N	f	f	92	53	Съемник пистонов	825206		Съёмник пистонов обшивки изогнутый 6мм	null	5.52	\N	IN_REQUEST	\N	\N	2025-10-25 09:21:49.05	\N	0	0	\N	22	\N	MONOLITH	f	\N
98	825206-20251025-122055305-915811/child-5-1761384109053-rxd51qj0k	21	\N	\N	2025-10-25 09:21:49.054	2025-10-25 09:21:49.054	\N	f	f	92	53	Съемник пистонов	825206		Съёмник пистонов обшивки изогнутый 6мм	null	5.52	\N	IN_REQUEST	\N	\N	2025-10-25 09:21:49.053	\N	0	0	\N	22	\N	MONOLITH	f	\N
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
114	800 410-20251025-133818002-310526	26	\N	\N	2025-10-25 10:38:18.004	2025-10-25 10:39:51.401	\N	f	f	\N	61	ременной	800 410		Съёмник масляных фильтров ременной Ø60-140 мм	null	35.46	\N	IN_REQUEST	\N	2025-10-25 10:39:29.39	2025-10-25 10:39:51.4	\N	1	0	\N	28	\N	MONOLITH	f	\N
112	jcb52510-20251025-133426397-082264	25	\N	\N	2025-10-25 10:34:26.399	2025-10-25 10:34:26.399	\N	f	f	\N	36	1/4 короткие	jcb52510		Головка 10мм (6гр.), 1/4''	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	26	\N	MONOLITH	f	\N
99	FK-905M11-20251025-122633062-026399	22	\N	\N	2025-10-25 09:26:33.064	2025-10-25 10:40:15.322	\N	f	f	\N	54	ПЛАСТИКОВЫЕ НАБОРЫ	FK-905M11		Набор приспособлений (пласт.) для демонтажа внутренней обшивки салона 11пр.	null	16.2	\N	ARRIVED	IN_STORE	2025-10-25 09:26:44.968	2025-10-25 09:27:05.479	\N	1	0	\N	23	\N	MONOLITH	f	\N
117	FK-933T1-12P-20251025-150749248-082852	27	\N	\N	2025-10-25 12:07:49.25	2025-10-25 12:07:49.25	\N	f	f	\N	65	шпильки	FK-933T1-12P		Болт к набору для замены сайлентблоков М12	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	29	\N	MONOLITH	f	\N
111	jcb52510-20251025-133343358-369602	25	3	2025-10-25 10:34:47.007	2025-10-25 10:33:43.359	2025-10-25 10:34:47.008	\N	f	f	\N	36	1/4 короткие	jcb52510		Головка 10мм (6гр.), 1/4''	null	1.5	\N	ARRIVED	SOLD	2025-10-25 10:33:58.978	2025-10-25 10:34:26.411	\N	1	0	\N	26	\N	MONOLITH	f	\N
127	40290-20251025-151659623-522743/child-4-1761394683720-3iof8diut	29	17	2025-10-25 12:18:38.771	2025-10-25 12:18:03.721	2025-10-25 12:18:38.772	\N	f	f	122	69	лямбда	40290		Головка разрезная для монтажа кислородного датчика 22 мм ½	null	12.42	\N	ARRIVED	SOLD	\N	2025-10-25 12:18:03.72	\N	0	0	\N	35	\N	MONOLITH	f	\N
123	40290-20251025-151803702-967255	29	\N	\N	2025-10-25 12:18:03.704	2025-10-25 12:18:03.704	\N	f	f	\N	69	лямбда	40290		Головка разрезная для монтажа кислородного датчика 22 мм ½	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	35	\N	MONOLITH	f	\N
120	KACN160B-20251025-151139405-456655/child-1-1761394356453-h829s3b1d	28	\N	\N	2025-10-25 12:12:36.454	2025-10-25 12:13:07.339	\N	f	f	118	66	ШАРНИР-УДАРНЫЙ	KACN160B		Шарнир ударный 1/2"х62мм TOPTUL	null	21.33	\N	ARRIVED	IN_STORE	\N	2025-10-25 12:12:36.453	\N	0	0	\N	33	\N	MONOLITH	f	\N
122	40290-20251025-151659623-522743	29	\N	\N	2025-10-25 12:16:59.625	2025-10-25 12:18:03.709	\N	f	f	\N	69	лямбда	40290		Головка разрезная для монтажа кислородного датчика 22 мм ½	null	\N	\N	SPROUTED	\N	2025-10-25 12:17:15.119	\N	\N	1	0	\N	35	\N	MONOLITH	f	\N
116	FK-933T1-12P-20251025-134723126-540473	27	30	2025-10-25 12:08:26.955	2025-10-25 10:47:23.127	2025-10-25 12:08:26.956	\N	f	f	\N	65	шпильки	FK-933T1-12P		Болт к набору для замены сайлентблоков М12	null	19.5	\N	ARRIVED	SOLD	2025-10-25 10:47:37.745	2025-10-25 12:07:49.262	\N	1	0	\N	29	\N	MONOLITH	f	\N
121	KACN160B-20251025-151139405-456655/child-2-1761394356456-mie08eeqx	28	30	2025-10-25 12:13:32.626	2025-10-25 12:12:36.457	2025-10-25 12:13:32.627	\N	f	f	118	66	ШАРНИР-УДАРНЫЙ	KACN160B		Шарнир ударный 1/2"х62мм TOPTUL	null	21.33	\N	ARRIVED	SOLD	\N	2025-10-25 12:12:36.456	\N	0	0	\N	33	\N	MONOLITH	f	\N
126	40290-20251025-151659623-522743/child-3-1761394683717-5x4bouxil	29	\N	\N	2025-10-25 12:18:03.718	2025-10-25 12:18:03.718	\N	f	f	122	69	лямбда	40290		Головка разрезная для монтажа кислородного датчика 22 мм ½	null	12.42	\N	IN_REQUEST	\N	\N	2025-10-25 12:18:03.717	\N	0	0	\N	35	\N	MONOLITH	f	\N
124	40290-20251025-151659623-522743/child-1-1761394683711-m0ljfxceq	29	\N	\N	2025-10-25 12:18:03.712	2025-10-25 12:18:18.042	\N	f	f	122	69	лямбда	40290		Головка разрезная для монтажа кислородного датчика 22 мм ½	null	12.42	\N	ARRIVED	IN_STORE	\N	2025-10-25 12:18:03.711	\N	0	0	\N	35	\N	MONOLITH	f	\N
125	40290-20251025-151659623-522743/child-2-1761394683714-e21dhwn9t	29	\N	\N	2025-10-25 12:18:03.715	2025-10-25 12:18:19.714	\N	f	f	122	69	лямбда	40290		Головка разрезная для монтажа кислородного датчика 22 мм ½	null	12.42	\N	ARRIVED	IN_STORE	\N	2025-10-25 12:18:03.714	\N	0	0	\N	35	\N	MONOLITH	f	\N
129	622019-20251025-153045137-629902	30	\N	\N	2025-10-25 12:30:45.139	2025-10-25 12:30:45.139	\N	f	f	\N	7	12-граней	622019		Головка двенадцатигранная 19мм 1/2"	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	36	\N	MONOLITH	f	\N
128	622019-20251025-152131315-439503	30	\N	\N	2025-10-25 12:21:31.317	2025-10-25 12:30:45.152	\N	f	f	\N	7	12-граней	622019		Головка двенадцатигранная 19мм 1/2"	null	\N	\N	SPROUTED	\N	2025-10-25 12:21:55.972	\N	\N	1	0	\N	36	\N	MONOLITH	f	\N
133	622019-20251025-152131315-439503/child-4-1761395445165-dt3t619l0	30	\N	\N	2025-10-25 12:30:45.167	2025-10-25 12:30:58.463	\N	f	f	128	7	12-граней	622019		Головка двенадцатигранная 19мм 1/2"	null	2.88	\N	ARRIVED	IN_STORE	\N	2025-10-25 12:30:45.165	\N	0	0	\N	36	\N	MONOLITH	f	\N
131	622019-20251025-152131315-439503/child-2-1761395445159-m1jlf5upg	30	\N	\N	2025-10-25 12:30:45.16	2025-10-25 12:31:01.492	\N	f	f	128	7	12-граней	622019		Головка двенадцатигранная 19мм 1/2"	null	2.88	\N	ARRIVED	IN_STORE	\N	2025-10-25 12:30:45.159	\N	0	0	\N	36	\N	MONOLITH	f	\N
130	622019-20251025-152131315-439503/child-1-1761395445154-dsjvef090	30	\N	\N	2025-10-25 12:30:45.156	2025-10-25 12:31:02.233	\N	f	f	128	7	12-граней	622019		Головка двенадцатигранная 19мм 1/2"	null	2.88	\N	ARRIVED	IN_STORE	\N	2025-10-25 12:30:45.155	\N	0	0	\N	36	\N	MONOLITH	f	\N
132	622019-20251025-152131315-439503/child-3-1761395445162-c2uukr7qs	30	5	2025-10-25 12:31:22.521	2025-10-25 12:30:45.163	2025-10-25 12:31:22.522	\N	f	f	128	7	12-граней	622019		Головка двенадцатигранная 19мм 1/2"	null	2.88	\N	ARRIVED	SOLD	\N	2025-10-25 12:30:45.162	\N	0	0	\N	36	\N	MONOLITH	f	\N
134	622021-20251025-154535185-883388	2	\N	\N	2025-10-25 12:45:35.188	2025-10-25 12:45:35.188	\N	f	f	\N	7	12-граней	622021		Головка двенадцатигранная 21 мм 1/2"	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	2	\N	MONOLITH	f	\N
136	rf802222-20251025-155052831-391411	31	\N	\N	2025-10-25 12:50:52.833	2025-10-25 12:50:52.833	\N	f	f	\N	71	1/4" Трещотки	rf802222		Трещотка реверсивная усиленная изогнутая с резиновой ручкой 1/4''(72зуб.)	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	37	\N	MONOLITH	f	\N
135	rf802222-20251025-155022087-196801	31	20	2025-10-25 12:51:17.987	2025-10-25 12:50:22.088	2025-10-25 12:51:17.988	\N	f	f	\N	71	1/4" Трещотки	rf802222		Трещотка реверсивная усиленная изогнутая с резиновой ручкой 1/4''(72зуб.)	null	14	\N	ARRIVED	SOLD	2025-10-25 12:50:32.887	2025-10-25 12:50:52.845	\N	1	0	\N	37	\N	MONOLITH	f	\N
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
33	Шарнир ударный 1/2	sharnir-udarnyy-1-2	66	\N	2025-10-25 12:10:27.983	2025-10-25 12:11:39.428	{"TOPTUL":{"displayName":"Шарнир ударный 1/2\\"х62мм TOPTUL","imagePath":"/media/products/28/KACN160B.webp","productCode":"KACN160B","updatedAt":"2025-10-25T12:11:39.427Z"}}	structure / ruchnoy-instrument / adaptery-perehodniki / sharnir-udarnyy / sharnir-udarnyy-1-2	structure/d_ruchnoy-instrument/d_adaptery-perehodniki/d_sharnir-udarnyy/s_sharnir-udarnyy-1-2
35	Ключ для датчика ''лямбда зонд''	klyuch-dlya-datchika-lyambda-zond	69	\N	2025-10-25 12:15:27.549	2025-10-25 12:16:59.646	{"Автодело":{"displayName":"Головка разрезная для монтажа кислородного датчика 22 мм ½","imagePath":"/media/products/29/40290.webp","productCode":"40290","updatedAt":"2025-10-25T12:16:59.644Z"}}	structure / spetsial-nyy-instrument / dvigatel / datchiki / lyambda / klyuch-dlya-datchika-lyambda-zond	structure/d_spetsial-nyy-instrument/d_dvigatel/d_datchiki/d_lyambda/s_klyuch-dlya-datchika-lyambda-zond
36	головка 19мм 12гр 1/2	golovka-19mm-12gr-1-2	7	\N	2025-10-25 12:20:10.621	2025-10-25 12:21:31.345	{"Дело техники":{"displayName":"Головка двенадцатигранная 19мм 1/2\\"","imagePath":"/media/products/30/622019.webp","productCode":"622019","updatedAt":"2025-10-25T12:21:31.344Z"}}	structure / ruchnoy-instrument / golovki-tortsevye / 1-2-korotkie / 12-graney / golovka-19mm-12gr-1-2	structure/d_ruchnoy-instrument/d_golovki-tortsevye/d_1-2-korotkie/d_12-graney/s_golovka-19mm-12gr-1-2
37	1/4" Трещотка [80222]	1-4-treschotka-80222	71	\N	2025-10-25 12:48:44.218	2025-10-25 12:50:22.219	{"RockForce":{"displayName":"Трещотка реверсивная усиленная изогнутая с резиновой ручкой 1/4''(72зуб.)","imagePath":"/media/products/31/rf802222.webp","productCode":"rf802222","updatedAt":"2025-10-25T12:50:22.218Z"}}	structure / ruchnoy-instrument / treschotki / 1-4-treschotki / 1-4-treschotka-80222	structure/d_ruchnoy-instrument/d_treschotki/d_1-4-treschotki/s_1-4-treschotka-80222
\.


--
-- Data for Name: suppliers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.suppliers (id, name) FROM stdin;
1	TT
2	Armtek
3	Форсаж
\.


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 1, false);


--
-- Name: brands_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.brands_id_seq', 11, true);


--
-- Name: cash_days_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cash_days_id_seq', 2, true);


--
-- Name: cash_events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cash_events_id_seq', 20, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 73, true);


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

SELECT pg_catalog.setval('public.inventory_snapshots_id_seq', 72, true);


--
-- Name: product_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_images_id_seq', 28, true);


--
-- Name: product_sales_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_sales_history_id_seq', 1, false);


--
-- Name: product_unit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_unit_logs_id_seq', 478, true);


--
-- Name: product_units_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_units_id_seq', 136, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 31, true);


--
-- Name: reorder_points_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reorder_points_id_seq', 1, false);


--
-- Name: spines_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.spines_id_seq', 37, true);


--
-- Name: suppliers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.suppliers_id_seq', 3, true);


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

