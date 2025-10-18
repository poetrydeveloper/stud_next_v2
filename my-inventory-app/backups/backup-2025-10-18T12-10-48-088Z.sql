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
    path text NOT NULL
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
    "spineId" integer
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
    "brandData" json
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
b9a1a592-e80a-44c8-bee3-179ba70283a1	6097743f8f826ee9c930d428445ca4871ba277989671ce520d018d9440ac1cbf	2025-10-14 12:04:44.458092+03	20250821120718_init	\N	\N	2025-10-14 12:04:44.449309+03	1
1d6ebdfe-ed22-4a48-81b9-ce9e3abe5c31	44334d5f147b873799966a3a4c3a60ae16f4642dbe3051542ad5ba0c496f69b4	2025-10-14 12:04:44.588946+03	20251005102252_add_brand_data_to_spine	\N	\N	2025-10-14 12:04:44.583408+03	1
840995a2-9b0e-4d42-980d-10ade6442149	a3c0b3d748399cbd945ab90c4b7d0b62dd3277636b6f41e87cf2ec16439e5f22	2025-10-14 12:04:44.482478+03	20250822101836_add_products	\N	\N	2025-10-14 12:04:44.458336+03	1
395a3be8-a305-4b9c-92cd-ce14e4ffbaff	2a036f61a9dffbb5eac2939f47e527dfa47bee8f57a95597890d2a50a7177975	2025-10-14 12:04:44.494538+03	20250828083337_add_requests	\N	\N	2025-10-14 12:04:44.482747+03	1
1ed01887-bce9-429e-b5e4-284c71007d42	7f43e3217dfed2f0a559c35e1da19e16d7b816d98a02e70d482b7e9dd92103d0	2025-10-14 12:04:44.496498+03	20250828090249_add_requestitem_status_nullable_request	\N	\N	2025-10-14 12:04:44.49478+03	1
e7d2eb69-7921-429b-9ca2-e35e55732b54	24bdb8206665439383f9f6aa150099ac964a315705acb3445597c0a79c0da539	2025-10-14 12:04:44.590113+03	20251008080927_add_storage_fields_to_product_image	\N	\N	2025-10-14 12:04:44.589213+03	1
c27f2925-c439-4359-af05-c144557fce7b	745a1cf4d376e55517ac77da7b1f71104dea18edeca26c34c5b18c693abbf29c	2025-10-14 12:04:44.508503+03	20250830104144_add_supplier_customer_relations	\N	\N	2025-10-14 12:04:44.496737+03	1
937a9658-bd55-4bff-91c7-b4bcbf38754d	a3daecbe80eafe9cd640334c371673cf2656a1ff2f0da969ec9254b28430cd9f	2025-10-14 12:04:44.515388+03	20250909092344_delivery	\N	\N	2025-10-14 12:04:44.508724+03	1
a29f15a6-9049-46d6-8428-70155b601989	f1667b9846849fff9b81db03f415362255ecc60e266d9d17eecf668fb0b97a1c	2025-10-14 12:04:44.524493+03	20250911110306_add_product_units_relations	\N	\N	2025-10-14 12:04:44.515599+03	1
95c9f482-3ade-4db0-af0e-5c727a7d1a13	976bcf0b774d3b5b5c6f2b936ab5276ce377c22fbb619248d946085ed8bc85ac	2025-10-14 12:04:44.599783+03	20251009111713_add_disassembly_feature	\N	\N	2025-10-14 12:04:44.590377+03	1
10b4b83d-67a2-4237-970c-7d84f4149c5f	5984d33527fb4d6d25fa428fc923aef47de57848a7680ebad02c34443617af1a	2025-10-14 12:04:44.547055+03	20250914115946_add_cash_system	\N	\N	2025-10-14 12:04:44.524739+03	1
09cf475e-f903-4d42-b17a-a764c485213f	ab92b7b4fc02e31c966eb076324f1af13faccf362c5b1d7ae74d3b2763cdd6b9	2025-10-14 12:04:44.550131+03	20250923114109_add_cash_event_relation	\N	\N	2025-10-14 12:04:44.547294+03	1
27c7081d-babd-4053-a3e4-cfc87d975598	8ee17ad1ab36533275c785a2a5b8c455e31d69dfd54d0e28d937384a230b7df1	2025-10-14 12:04:44.565919+03	20250925093430_init	\N	\N	2025-10-14 12:04:44.550432+03	1
a0376433-a17e-4b50-9286-1e301c45d241	bb96e01bddaff8038b65f4ac87980ef3fc16032a94f6fa276e5abed4ac9c329d	2025-10-14 12:04:44.604334+03	20251010105616_fix_disassembly_relations	\N	\N	2025-10-14 12:04:44.600057+03	1
aab4e69a-6b5b-47df-b31f-02d30646fff2	91366dd8358f057d1b5d8ebf866055be3b6f6b9cfff556e365bed43cf77a6d1e	2025-10-14 12:04:44.567074+03	20250925110251_add_productunit_fields	\N	\N	2025-10-14 12:04:44.566227+03	1
db95ec42-f7d7-458e-95b5-7798a7ed08a2	b9586b45cf17922689d38e947d36e009e886f2a8f078053e2f25cf95ed31b724	2025-10-14 12:04:44.577086+03	20250926073852_add_spine_entity	\N	\N	2025-10-14 12:04:44.567339+03	1
8d4ecdb7-b280-40ff-ba83-98cd54e2febe	7e52e1dd5f7801459ab5ccefdb186139920e153dd53377ce73e41264c5ec8544	2025-10-14 12:04:44.58317+03	20250930104749_add_product_unit_logs	\N	\N	2025-10-14 12:04:44.577351+03	1
5b22a0fb-21ce-49b3-90f6-716447fbbeab	6960f5f257e7d094fbb055b1ebe942896c1e156f74032f257e072ff02026c28f	2025-10-15 10:34:18.237885+03	20251015073418_add_inventory_analytics_models	\N	\N	2025-10-15 10:34:18.201489+03	1
\.


--
-- Data for Name: brands; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.brands (id, name, slug, "createdAt", "updatedAt") FROM stdin;
1	Force	force	2025-10-14 09:20:26.65	2025-10-14 09:20:26.65
2	Forsage	forsage	2025-10-14 09:20:34.521	2025-10-14 09:20:34.521
3	RockFORCE	rockforce	2025-10-14 09:23:19.676	2025-10-14 09:23:19.676
4	Дело техники	delo-tehniki	2025-10-14 10:13:36.002	2025-10-14 10:13:36.002
5	JCB	jcb	2025-10-14 11:42:04.291	2025-10-14 11:42:04.291
6	Partner	partner	2025-10-14 12:05:05.836	2025-10-14 12:05:05.836
7	FORCEKRAFT	forcekraft	2025-10-15 09:22:32.924	2025-10-15 09:22:32.924
8	TOPTUL	toptul	2025-10-15 09:37:21.578	2025-10-15 09:37:21.578
9	Автодело	avtodelo	2025-10-15 11:15:39.523	2025-10-15 11:15:39.523
10	Scheppach	scheppach	2025-10-17 08:17:26.611	2025-10-17 08:17:26.611
11	STARTUL	startul	2025-10-17 10:11:46.886	2025-10-17 10:11:46.886
12	СибрТех	sibrteh	2025-10-18 06:44:05.567	2025-10-18 06:44:05.567
13	Эврика	evrika	2025-10-18 06:49:16.5	2025-10-18 06:49:16.5
14	GEPARD	gepard	2025-10-18 07:23:21.869	2025-10-18 07:23:21.869
\.


--
-- Data for Name: cash_days; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cash_days (id, date, is_closed, total, created_at, updated_at) FROM stdin;
1	2025-10-13 21:00:00	t	184.44	2025-10-14 09:28:12.938	2025-10-14 20:59:59.999
2	2025-10-14 21:00:00	t	392	2025-10-15 06:59:52.929	2025-10-15 12:46:49.334
3	2025-10-15 21:00:00	t	322	2025-10-16 08:48:32.935	2025-10-16 12:47:42.235
4	2025-10-16 21:00:00	f	185	2025-10-17 06:48:42.571	2025-10-17 10:16:22.376
5	2025-10-17 21:00:00	t	12.5	2025-10-18 06:11:47.537	2025-10-18 12:10:04.582
\.


--
-- Data for Name: cash_events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cash_events (id, type, amount, notes, cash_day_id, product_unit_id, created_at) FROM stdin;
1	SALE	12	Продажа: Головка ударная 36мм (12гр.), 1/2''	1	1	2025-10-14 09:30:56.717
2	SALE	5	Продажа: Головка TORX E10 1/4"	1	15	2025-10-14 11:20:13.105
3	SALE	8.22	Продажа: Ключ накидной TORX Е10×Е12	1	18	2025-10-14 11:33:23.008
4	RETURN	-8.22	Возврат: Ключ накидной TORX Е10×Е12 (Возврат товара)	1	18	2025-10-14 11:33:43.749
5	SALE	12	Продажа: Ключ накидной TORX Е10×Е12	1	18	2025-10-14 11:34:34.177
6	SALE	10	Продажа: Головка двенадцатигранная 30мм 1/2"	1	22	2025-10-14 11:39:54.982
7	SALE	40	Продажа: Подставка ремонтная 2т (h min 278mm, h max 425mm)	1	27	2025-10-14 11:49:57.11
8	SALE	25	Продажа: Съемник рулевых тяг универсальный 27-42мм, 1/2''	1	28	2025-10-14 12:03:55.155
9	RETURN	-25	Возврат: Съемник рулевых тяг универсальный 27-42мм, 1/2'' (Возврат товара)	1	28	2025-10-14 12:04:07.791
10	SALE	25	Продажа: Сверло ступенчатое HSS 4241(4-32мм), в блистере	1	30	2025-10-14 12:08:58.924
11	SALE	14	Продажа: Ключ комбинированный трещоточный 13мм	1	32	2025-10-14 12:14:02.338
12	SALE	8	Продажа: Головка глубокая 17мм (6гр.), 1/2''	2	47	2025-10-15 09:20:40.434
13	SALE	35	Продажа: Набор головок Е-профиль,14пр(1/4'':Е4,5,6,7,8, 3/8:Е10,11,12,14, 1/2'':Е16,18,20,22,24),на планке	2	49	2025-10-15 09:32:32.415
14	SALE	5	Продажа: Переходник 1/2"(F)х3/8(М) TOPTUL	2	51	2025-10-15 09:41:46.279
15	SALE	20	Продажа: Ключ шкива коленвала 36×38 мм (112171)	2	53	2025-10-15 09:49:52.173
16	SALE	10	Продажа: Съёмник пистонов обшивки изогнутый 6мм	2	65	2025-10-15 10:18:34.811
17	SALE	14	Продажа: Быстроразъем пневматический с клапаном-наружняя резьба 3/8''	2	99	2025-10-15 11:35:27.812
18	SALE	300	Продажа: Набор инструментов 216пр. 1/4'', 3/8'', 1/2''(6гр.)(4-32мм)	2	101	2025-10-15 12:45:09.427
19	SALE	7	Продажа: Головка двенадцатигранная 19мм 1/2"	3	121	2025-10-16 08:49:02.572
20	SALE	12	Продажа: Трещотка реверсивная усиленная изогнутая с резиновой ручкой 1/4''(72зуб.)	3	126	2025-10-16 08:56:15.578
21	SALE	260	Продажа: Набор инструментов 108пр.1/4''&1/2''(6гр.)(4-32мм)	3	127	2025-10-16 09:05:41.361
22	SALE	20	Продажа: Головка 1/2" с насадкой HEX 17мм TOPTUL	3	134	2025-10-16 09:13:42.588
23	SALE	6	Продажа: Бита SPLINE M12х75мм,10мм	3	142	2025-10-16 09:24:45.908
24	SALE	17	Продажа: Набор щупов 32пр. (0.04-0.88мм), в чехле	3	143	2025-10-16 09:32:05.722
25	SALE	4	Продажа: Головка шестигранная 8мм 3/8"	4	147	2025-10-17 06:59:33.807
26	SALE	22	Продажа: Набор экстракторов 5шт TOPTUL	4	149	2025-10-17 07:06:45.926
27	SALE	10	Продажа: Метчик M10x1,25 (3шт)	4	157	2025-10-17 08:33:21.913
28	SALE	30	Продажа: Съемник внутрених стопорных колец изогнутый 90грд. (глубина-56мм, для суппортов), в блистере	4	159	2025-10-17 09:43:19.401
29	SALE	30	Продажа: Клещи для хомутов ШРУСа	4	161	2025-10-17 09:57:38.743
30	SALE	22	Продажа: Набор ключей TORX с отверстием удлинённых 9шт.	4	113	2025-10-17 09:59:16.529
31	SALE	15	Продажа: Вставка для разборки стойки амортизатора (Nissan) 4мм Rock FORCE RF-1022-34	4	164	2025-10-17 10:10:09.785
32	SALE	52	Продажа: Набор ключей накидн. 6-22мм 8шт PRO STARTUL GT (PRO-83008) (пласт. подвес)	4	166	2025-10-17 10:16:22.375
33	SALE	3	Продажа: Щётка-мини, нейлоновая щетина	5	156	2025-10-18 06:12:17.726
34	SALE	6	Продажа: Щетка-мини по металлу ручная в пластиковом корпусе с прорезиненной рукояткой (проволока из нержавеющей стали, 3x10рядов)	5	168	2025-10-18 06:19:33.577
35	SALE	3.5	Продажа: Круг лепестковый 125х22мм P80 плоск. GEPARD (GP5016-80) (плоский КЛТ-1)	5	196	2025-10-18 07:27:45.574
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, slug, path) FROM stdin;
1	Ручной инструмент	ruchnoy-instrument	/ruchnoy-instrument
2	Головки торцовые	golovki-tortsovye	/ruchnoy-instrument/golovki-tortsovye
3	1/2" ударные короткие	1-2-udarnye-korotkie	/ruchnoy-instrument/golovki-tortsovye/1-2-udarnye-korotkie
4	Е-профиль	e-profil	/ruchnoy-instrument/golovki-tortsovye/e-profil
5	E-Инструмент 1/4"	e-instrument-1-4	/ruchnoy-instrument/golovki-tortsovye/e-profil/e-instrument-1-4
6	Ключи	klyuchi	/ruchnoy-instrument/klyuchi
7	E-типа	e-tipa	/ruchnoy-instrument/klyuchi/e-tipa
8	1/2" короткие	1-2-korotkie	/ruchnoy-instrument/golovki-tortsovye/1-2-korotkie
9	Оборудование	oborudovanie	/oborudovanie
10	Подъемное	pod-emnoe	/oborudovanie/pod-emnoe
11	Подставки	podstavki	/oborudovanie/pod-emnoe/podstavki
12	Специальный инструмент	spetsial-nyy-instrument	/spetsial-nyy-instrument
13	Ходовая часть	hodovaya-chast	/spetsial-nyy-instrument/hodovaya-chast
14	Тяги, шаровые опоры	tyagi-sharovye-opory	/spetsial-nyy-instrument/hodovaya-chast/tyagi-sharovye-opory
15	Съемник рулевых тяг	s-emnik-rulevyh-tyag	/spetsial-nyy-instrument/hodovaya-chast/tyagi-sharovye-opory/s-emnik-rulevyh-tyag
16	Металлообработка	metalloobrabotka	/ruchnoy-instrument/metalloobrabotka
17	Сверла, фрезы	sverla-frezy	/ruchnoy-instrument/metalloobrabotka/sverla-frezy
18	Сверло ступенчатое	sverlo-stupenchatoe	/ruchnoy-instrument/metalloobrabotka/sverla-frezy/sverlo-stupenchatoe
19	Трещеточные	treschetochnye	/ruchnoy-instrument/klyuchi/treschetochnye
20	Ключ комбинированный трещоточный	klyuch-kombinirovannyy-treschotochnyy	/ruchnoy-instrument/klyuchi/treschetochnye/klyuch-kombinirovannyy-treschotochnyy
21	Биты	bity	/ruchnoy-instrument/bity
22	10мм длинные	10mm-dlinnye	/ruchnoy-instrument/bity/10mm-dlinnye
43	Г-образные Torx наборы	g-obraznye-torx-nabory	/ruchnoy-instrument/klyuchi/g-obraznye-torx-nabory
44	1/4" Трещотки	1-4-treschotki	/ruchnoy-instrument/vorotki-udliniteli-treschotki/1-4-treschotki
45	Наборы инструментов	nabory-instrumentov-1	/ruchnoy-instrument/nabory-instrumentov-1
46	Головки биты 1/2"	golovki-bity-1-2	/ruchnoy-instrument/bity/golovki-bity-1-2
47	Бита SPLINE M12х75мм,10мм	bita-spline-m12h75mm-10mm	/ruchnoy-instrument/bity/10mm-dlinnye/bita-spline-m12h75mm-10mm
48	Измерительный	izmeritel-nyy	/ruchnoy-instrument/izmeritel-nyy
49	Щупы, шаблоны	schupy-shablony	/ruchnoy-instrument/izmeritel-nyy/schupy-shablony
50	3/8" короткие	3-8-korotkie	/ruchnoy-instrument/golovki-tortsovye/3-8-korotkie
51	Экстракторы	ekstraktory	/ruchnoy-instrument/metalloobrabotka/ekstraktory
52	Наборы экстракторов	nabory-ekstraktorov	/ruchnoy-instrument/metalloobrabotka/ekstraktory/nabory-ekstraktorov
53	Щётки ручные	schyotki-ruchnye	/ruchnoy-instrument/izmeritel-nyy-i-rezhuschiy-instrument/schyotki-ruchnye
54	Щётки-мини	schyotki-mini	/ruchnoy-instrument/izmeritel-nyy-i-rezhuschiy-instrument/schyotki-ruchnye/schyotki-mini
55	Метчики, плашки, воротки	metchiki-plashki-vorotki	/ruchnoy-instrument/metalloobrabotka/metchiki-plashki-vorotki
56	Шарнирно-губцевый	sharnirno-gubtsevyy	/ruchnoy-instrument/sharnirno-gubtsevyy
57	Стопорные кольца	stopornye-kol-tsa	/ruchnoy-instrument/sharnirno-gubtsevyy/stopornye-kol-tsa
58	Суппортовые	supportovye	/ruchnoy-instrument/sharnirno-gubtsevyy/stopornye-kol-tsa/supportovye
23	1/2" глубокие	1-2-glubokie	/ruchnoy-instrument/golovki-tortsovye/1-2-glubokie
24	Набор головок Е-профиль	nabor-golovok-e-profil	/ruchnoy-instrument/golovki-tortsovye/e-profil/nabor-golovok-e-profil
25	Воротки, удлинители, трещотки	vorotki-udliniteli-treschotki	/ruchnoy-instrument/vorotki-udliniteli-treschotki
26	Адаптеры, переходники	adaptery-perehodniki	/ruchnoy-instrument/vorotki-udliniteli-treschotki/adaptery-perehodniki
27	Адаптер-переходник 1/2''(F) x 3/8''(M)	adapter-perehodnik-1-2-f-x-3-8-m	/ruchnoy-instrument/vorotki-udliniteli-treschotki/adaptery-perehodniki/adapter-perehodnik-1-2-f-x-3-8-m
28	Специнструмент для работы с двигателем	spetsinstrument-dlya-raboty-s-dvigatelem	/spetsial-nyy-instrument/spetsinstrument-dlya-raboty-s-dvigatelem
29	Шкивы и Шестерни	shkivy-i-shesterni	/spetsial-nyy-instrument/spetsinstrument-dlya-raboty-s-dvigatelem/shkivy-i-shesterni
30	Разбор автомобиля	razbor-avtomobilya	/spetsial-nyy-instrument/razbor-avtomobilya
31	Пистонодеры	pistonodery	/spetsial-nyy-instrument/razbor-avtomobilya/pistonodery
32	Наборы бит, головок-бит, биты	nabory-bit-golovok-bit-bity	/ruchnoy-instrument/nabory-bit-golovok-bit-bity
33	биты-поштучно	bity-poshtuchno	/ruchnoy-instrument/nabory-bit-golovok-bit-bity/bity-poshtuchno
34	Измерительный и режущий инструмент	izmeritel-nyy-i-rezhuschiy-instrument	/ruchnoy-instrument/izmeritel-nyy-i-rezhuschiy-instrument
35	Щётки для УШМ	schyotki-dlya-ushm	/ruchnoy-instrument/izmeritel-nyy-i-rezhuschiy-instrument/schyotki-dlya-ushm
36	Щетки на дрель (набор)	schetki-na-drel-nabor	/ruchnoy-instrument/izmeritel-nyy-i-rezhuschiy-instrument/schyotki-dlya-ushm/schetki-na-drel-nabor
37	Съёмники масляных фильтров	s-yomniki-maslyanyh-fil-trov	/spetsial-nyy-instrument/spetsinstrument-dlya-raboty-s-dvigatelem/s-yomniki-maslyanyh-fil-trov
38	Пневматика	pnevmatika	/pnevmatika
39	Оснастка	osnastka	/pnevmatika/osnastka
40	Быстроразъемы	bystroraz-emy	/pnevmatika/osnastka/bystroraz-emy
41	Наборы инструментов	nabory-instrumentov	/ruchnoy-instrument/nabory-instrumentov
42	1/4" и 3/8" и 1/2"	1-4-i-3-8-i-1-2	/ruchnoy-instrument/nabory-instrumentov/1-4-i-3-8-i-1-2
59	Специнструмент для работ со ШРУСом	spetsinstrument-dlya-rabot-so-shrusom	/spetsial-nyy-instrument/hodovaya-chast/spetsinstrument-dlya-rabot-so-shrusom
60	СТОЙКА	stoyka	/spetsial-nyy-instrument/stoyka
61	Съемники амортизаторов и стоек	s-emniki-amortizatorov-i-stoek	/spetsial-nyy-instrument/stoyka/s-emniki-amortizatorov-i-stoek
62	Ключи накидные (НАБОРЫ)	klyuchi-nakidnye-nabory	/ruchnoy-instrument/klyuchi/klyuchi-nakidnye-nabory
63	Круги лепестковые ф125мм	krugi-lepestkovye-f125mm	/ruchnoy-instrument/metalloobrabotka/krugi-lepestkovye-f125mm
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
1	Разборка на 2 частей	2	t	2025-10-14 11:49:04.391	2025-10-14 11:49:04.391	["JCB-TH52002C-Part", "JCB-TH52002C-Part2"]	JCB-TH52002C
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
176	2025-10-14 21:00:00	\N	IN_STORE	1.38	13.8	daily	2025-10-15 12:46:59.743
177	2025-10-14 21:00:00	\N	IN_STORE	8.22	8.22	daily	2025-10-15 12:46:59.745
178	2025-10-14 21:00:00	\N	IN_STORE	0	0	daily	2025-10-15 12:46:59.747
179	2025-10-14 21:00:00	\N	IN_STORE	10.92	10.92	daily	2025-10-15 12:46:59.749
180	2025-10-14 21:00:00	\N	IN_STORE	2.34	25.74	daily	2025-10-15 12:46:59.75
181	2025-10-14 21:00:00	\N	IN_STORE	3.37	3.37	daily	2025-10-15 12:46:59.752
182	2025-10-14 21:00:00	\N	IN_STORE	5.76	5.76	daily	2025-10-15 12:46:59.754
183	2025-10-14 21:00:00	\N	IN_STORE	2.16	10.8	daily	2025-10-15 12:46:59.756
184	2025-10-14 21:00:00	\N	IN_STORE	2.16	2.16	daily	2025-10-15 12:46:59.758
185	2025-10-14 21:00:00	10	IN_STORE	\N	0	daily	2025-10-15 12:46:59.762
186	2025-10-14 21:00:00	7	IN_STORE	\N	0	daily	2025-10-15 12:46:59.763
187	2025-10-14 21:00:00	14	IN_STORE	\N	0	daily	2025-10-15 12:46:59.764
188	2025-10-14 21:00:00	8	IN_STORE	\N	0	daily	2025-10-15 12:46:59.764
189	2025-10-14 21:00:00	11	IN_STORE	\N	0	daily	2025-10-15 12:46:59.765
190	2025-10-14 21:00:00	5	IN_STORE	\N	0	daily	2025-10-15 12:46:59.766
191	2025-10-14 21:00:00	12	IN_STORE	\N	0	daily	2025-10-15 12:46:59.767
192	2025-10-14 21:00:00	6	IN_STORE	\N	0	daily	2025-10-15 12:46:59.768
193	2025-10-14 21:00:00	9	IN_STORE	\N	0	daily	2025-10-15 12:46:59.769
194	2025-10-14 21:00:00	13	IN_STORE	\N	0	daily	2025-10-15 12:46:59.77
195	2025-10-14 21:00:00	26	IN_STORE	\N	0	daily	2025-10-15 12:46:59.77
196	2025-10-14 21:00:00	28	IN_STORE	\N	0	daily	2025-10-15 12:46:59.771
197	2025-10-14 21:00:00	19	IN_STORE	\N	0	daily	2025-10-15 12:46:59.772
198	2025-10-14 21:00:00	38	IN_STORE	\N	0	daily	2025-10-15 12:46:59.773
199	2025-10-14 21:00:00	36	IN_STORE	\N	0	daily	2025-10-15 12:46:59.774
200	2025-10-14 21:00:00	37	IN_STORE	\N	0	daily	2025-10-15 12:46:59.775
201	2025-10-14 21:00:00	39	IN_STORE	\N	0	daily	2025-10-15 12:46:59.776
202	2025-10-14 21:00:00	40	IN_STORE	\N	0	daily	2025-10-15 12:46:59.777
203	2025-10-14 21:00:00	41	IN_STORE	\N	0	daily	2025-10-15 12:46:59.777
204	2025-10-14 21:00:00	42	IN_STORE	\N	0	daily	2025-10-15 12:46:59.778
205	2025-10-14 21:00:00	43	IN_STORE	\N	0	daily	2025-10-15 12:46:59.779
206	2025-10-14 21:00:00	44	IN_STORE	\N	0	daily	2025-10-15 12:46:59.78
207	2025-10-14 21:00:00	45	IN_STORE	\N	0	daily	2025-10-15 12:46:59.781
208	2025-10-14 21:00:00	46	IN_STORE	\N	0	daily	2025-10-15 12:46:59.782
209	2025-10-14 21:00:00	57	IN_STORE	\N	0	daily	2025-10-15 12:46:59.783
210	2025-10-14 21:00:00	62	IN_STORE	\N	0	daily	2025-10-15 12:46:59.784
211	2025-10-14 21:00:00	80	IN_STORE	\N	0	daily	2025-10-15 12:46:59.785
212	2025-10-14 21:00:00	68	IN_STORE	\N	0	daily	2025-10-15 12:46:59.786
213	2025-10-14 21:00:00	72	IN_STORE	\N	0	daily	2025-10-15 12:46:59.787
214	2025-10-14 21:00:00	71	IN_STORE	\N	0	daily	2025-10-15 12:46:59.788
215	2025-10-14 21:00:00	70	IN_STORE	\N	0	daily	2025-10-15 12:46:59.789
216	2025-10-14 21:00:00	69	IN_STORE	\N	0	daily	2025-10-15 12:46:59.789
217	2025-10-15 21:00:00	\N	IN_STORE	1.38	13.8	daily	2025-10-16 12:47:08.866
218	2025-10-15 21:00:00	\N	IN_STORE	8.22	8.22	daily	2025-10-16 12:47:08.883
219	2025-10-15 21:00:00	\N	IN_STORE	0	0	daily	2025-10-16 12:47:08.886
220	2025-10-15 21:00:00	\N	IN_STORE	10.92	10.92	daily	2025-10-16 12:47:08.959
221	2025-10-15 21:00:00	\N	IN_STORE	2.34	25.74	daily	2025-10-16 12:47:08.974
222	2025-10-15 21:00:00	\N	IN_STORE	3.37	3.37	daily	2025-10-16 12:47:08.988
223	2025-10-15 21:00:00	\N	IN_STORE	5.76	5.76	daily	2025-10-16 12:47:09.002
224	2025-10-15 21:00:00	\N	IN_STORE	2.16	10.8	daily	2025-10-16 12:47:09.011
225	2025-10-15 21:00:00	\N	IN_STORE	2.16	2.16	daily	2025-10-16 12:47:09.025
226	2025-10-15 21:00:00	\N	IN_STORE	15.9	31.8	daily	2025-10-16 12:47:09.035
227	2025-10-15 21:00:00	\N	IN_STORE	2.94	14.7	daily	2025-10-16 12:47:09.065
228	2025-10-15 21:00:00	\N	IN_STORE	9.72	19.44	daily	2025-10-16 12:47:09.085
229	2025-10-15 21:00:00	\N	IN_STORE	9.64	28.92	daily	2025-10-16 12:47:09.1
230	2025-10-15 21:00:00	\N	IN_STORE	3.12	15.6	daily	2025-10-16 12:47:09.103
231	2025-10-15 21:00:00	10	IN_STORE	\N	0	daily	2025-10-16 12:47:09.107
232	2025-10-15 21:00:00	7	IN_STORE	\N	0	daily	2025-10-16 12:47:09.109
233	2025-10-15 21:00:00	14	IN_STORE	\N	0	daily	2025-10-16 12:47:09.111
234	2025-10-15 21:00:00	8	IN_STORE	\N	0	daily	2025-10-16 12:47:09.113
235	2025-10-15 21:00:00	11	IN_STORE	\N	0	daily	2025-10-16 12:47:09.114
236	2025-10-15 21:00:00	5	IN_STORE	\N	0	daily	2025-10-16 12:47:09.116
237	2025-10-15 21:00:00	12	IN_STORE	\N	0	daily	2025-10-16 12:47:09.117
238	2025-10-15 21:00:00	6	IN_STORE	\N	0	daily	2025-10-16 12:47:09.118
239	2025-10-15 21:00:00	9	IN_STORE	\N	0	daily	2025-10-16 12:47:09.119
240	2025-10-15 21:00:00	13	IN_STORE	\N	0	daily	2025-10-16 12:47:09.12
241	2025-10-15 21:00:00	26	IN_STORE	\N	0	daily	2025-10-16 12:47:09.121
242	2025-10-15 21:00:00	28	IN_STORE	\N	0	daily	2025-10-16 12:47:09.123
243	2025-10-15 21:00:00	19	IN_STORE	\N	0	daily	2025-10-16 12:47:09.125
244	2025-10-15 21:00:00	38	IN_STORE	\N	0	daily	2025-10-16 12:47:09.126
245	2025-10-15 21:00:00	36	IN_STORE	\N	0	daily	2025-10-16 12:47:09.127
246	2025-10-15 21:00:00	37	IN_STORE	\N	0	daily	2025-10-16 12:47:09.129
247	2025-10-15 21:00:00	39	IN_STORE	\N	0	daily	2025-10-16 12:47:09.13
248	2025-10-15 21:00:00	40	IN_STORE	\N	0	daily	2025-10-16 12:47:09.131
249	2025-10-15 21:00:00	41	IN_STORE	\N	0	daily	2025-10-16 12:47:09.132
250	2025-10-15 21:00:00	42	IN_STORE	\N	0	daily	2025-10-16 12:47:09.133
251	2025-10-15 21:00:00	43	IN_STORE	\N	0	daily	2025-10-16 12:47:09.133
252	2025-10-15 21:00:00	44	IN_STORE	\N	0	daily	2025-10-16 12:47:09.134
253	2025-10-15 21:00:00	45	IN_STORE	\N	0	daily	2025-10-16 12:47:09.135
254	2025-10-15 21:00:00	46	IN_STORE	\N	0	daily	2025-10-16 12:47:09.137
255	2025-10-15 21:00:00	125	IN_STORE	\N	0	daily	2025-10-16 12:47:09.138
256	2025-10-15 21:00:00	124	IN_STORE	\N	0	daily	2025-10-16 12:47:09.138
257	2025-10-15 21:00:00	141	IN_STORE	\N	0	daily	2025-10-16 12:47:09.139
258	2025-10-15 21:00:00	133	IN_STORE	\N	0	daily	2025-10-16 12:47:09.141
259	2025-10-15 21:00:00	113	IN_STORE	\N	0	daily	2025-10-16 12:47:09.142
260	2025-10-15 21:00:00	112	IN_STORE	\N	0	daily	2025-10-16 12:47:09.143
261	2025-10-15 21:00:00	140	IN_STORE	\N	0	daily	2025-10-16 12:47:09.144
262	2025-10-15 21:00:00	139	IN_STORE	\N	0	daily	2025-10-16 12:47:09.145
263	2025-10-15 21:00:00	138	IN_STORE	\N	0	daily	2025-10-16 12:47:09.175
264	2025-10-15 21:00:00	137	IN_STORE	\N	0	daily	2025-10-16 12:47:09.177
265	2025-10-15 21:00:00	57	IN_STORE	\N	0	daily	2025-10-16 12:47:09.178
266	2025-10-15 21:00:00	62	IN_STORE	\N	0	daily	2025-10-16 12:47:09.179
267	2025-10-15 21:00:00	80	IN_STORE	\N	0	daily	2025-10-16 12:47:09.181
268	2025-10-15 21:00:00	68	IN_STORE	\N	0	daily	2025-10-16 12:47:09.182
269	2025-10-15 21:00:00	72	IN_STORE	\N	0	daily	2025-10-16 12:47:09.183
270	2025-10-15 21:00:00	71	IN_STORE	\N	0	daily	2025-10-16 12:47:09.184
271	2025-10-15 21:00:00	70	IN_STORE	\N	0	daily	2025-10-16 12:47:09.185
272	2025-10-15 21:00:00	69	IN_STORE	\N	0	daily	2025-10-16 12:47:09.186
273	2025-10-15 21:00:00	119	IN_STORE	\N	0	daily	2025-10-16 12:47:09.187
274	2025-10-15 21:00:00	120	IN_STORE	\N	0	daily	2025-10-16 12:47:09.188
275	2025-10-15 21:00:00	118	IN_STORE	\N	0	daily	2025-10-16 12:47:09.189
276	2025-10-15 21:00:00	117	IN_STORE	\N	0	daily	2025-10-16 12:47:09.19
277	2025-10-15 21:00:00	116	IN_STORE	\N	0	daily	2025-10-16 12:47:09.191
278	2025-10-15 21:00:00	132	IN_STORE	\N	0	daily	2025-10-16 12:47:09.191
279	2025-10-15 21:00:00	131	IN_STORE	\N	0	daily	2025-10-16 12:47:09.192
280	2025-10-16 21:00:00	\N	IN_STORE	1.38	13.8	daily	2025-10-17 13:00:02.754
281	2025-10-16 21:00:00	\N	IN_STORE	8.22	8.22	daily	2025-10-17 13:00:02.762
282	2025-10-16 21:00:00	\N	IN_STORE	7.26	7.26	daily	2025-10-17 13:00:02.765
283	2025-10-16 21:00:00	\N	IN_STORE	0	0	daily	2025-10-17 13:00:02.767
284	2025-10-16 21:00:00	\N	IN_STORE	10.92	10.92	daily	2025-10-17 13:00:02.769
285	2025-10-16 21:00:00	\N	IN_STORE	2.34	25.74	daily	2025-10-17 13:00:02.771
286	2025-10-16 21:00:00	\N	IN_STORE	3.37	3.37	daily	2025-10-17 13:00:02.773
287	2025-10-16 21:00:00	\N	IN_STORE	5.76	5.76	daily	2025-10-17 13:00:02.775
288	2025-10-16 21:00:00	\N	IN_STORE	2.16	10.8	daily	2025-10-17 13:00:02.778
289	2025-10-16 21:00:00	\N	IN_STORE	2.16	2.16	daily	2025-10-17 13:00:02.78
290	2025-10-16 21:00:00	\N	IN_STORE	2.94	14.7	daily	2025-10-17 13:00:02.782
291	2025-10-16 21:00:00	\N	IN_STORE	9.72	19.44	daily	2025-10-17 13:00:02.784
292	2025-10-16 21:00:00	\N	IN_STORE	9.64	28.92	daily	2025-10-17 13:00:02.786
293	2025-10-16 21:00:00	\N	IN_STORE	3.12	15.6	daily	2025-10-17 13:00:02.789
294	2025-10-16 21:00:00	\N	IN_STORE	1.32	5.28	daily	2025-10-17 13:00:02.792
295	2025-10-16 21:00:00	10	IN_STORE	\N	0	daily	2025-10-17 13:00:02.795
296	2025-10-16 21:00:00	7	IN_STORE	\N	0	daily	2025-10-17 13:00:02.796
297	2025-10-16 21:00:00	14	IN_STORE	\N	0	daily	2025-10-17 13:00:02.798
298	2025-10-16 21:00:00	8	IN_STORE	\N	0	daily	2025-10-17 13:00:02.799
299	2025-10-16 21:00:00	11	IN_STORE	\N	0	daily	2025-10-17 13:00:02.8
300	2025-10-16 21:00:00	5	IN_STORE	\N	0	daily	2025-10-17 13:00:02.801
301	2025-10-16 21:00:00	12	IN_STORE	\N	0	daily	2025-10-17 13:00:02.801
302	2025-10-16 21:00:00	6	IN_STORE	\N	0	daily	2025-10-17 13:00:02.802
303	2025-10-16 21:00:00	9	IN_STORE	\N	0	daily	2025-10-17 13:00:02.803
304	2025-10-16 21:00:00	13	IN_STORE	\N	0	daily	2025-10-17 13:00:02.804
305	2025-10-16 21:00:00	26	IN_STORE	\N	0	daily	2025-10-17 13:00:02.805
306	2025-10-16 21:00:00	28	IN_STORE	\N	0	daily	2025-10-17 13:00:02.806
307	2025-10-16 21:00:00	19	IN_STORE	\N	0	daily	2025-10-17 13:00:02.806
308	2025-10-16 21:00:00	38	IN_STORE	\N	0	daily	2025-10-17 13:00:02.807
309	2025-10-16 21:00:00	36	IN_STORE	\N	0	daily	2025-10-17 13:00:02.808
310	2025-10-16 21:00:00	37	IN_STORE	\N	0	daily	2025-10-17 13:00:02.809
311	2025-10-16 21:00:00	39	IN_STORE	\N	0	daily	2025-10-17 13:00:02.81
312	2025-10-16 21:00:00	40	IN_STORE	\N	0	daily	2025-10-17 13:00:02.811
313	2025-10-16 21:00:00	41	IN_STORE	\N	0	daily	2025-10-17 13:00:02.812
314	2025-10-16 21:00:00	42	IN_STORE	\N	0	daily	2025-10-17 13:00:02.812
315	2025-10-16 21:00:00	43	IN_STORE	\N	0	daily	2025-10-17 13:00:02.814
316	2025-10-16 21:00:00	44	IN_STORE	\N	0	daily	2025-10-17 13:00:02.814
317	2025-10-16 21:00:00	45	IN_STORE	\N	0	daily	2025-10-17 13:00:02.815
318	2025-10-16 21:00:00	46	IN_STORE	\N	0	daily	2025-10-17 13:00:02.816
319	2025-10-16 21:00:00	125	IN_STORE	\N	0	daily	2025-10-17 13:00:02.817
320	2025-10-16 21:00:00	124	IN_STORE	\N	0	daily	2025-10-17 13:00:02.818
321	2025-10-16 21:00:00	141	IN_STORE	\N	0	daily	2025-10-17 13:00:02.819
322	2025-10-16 21:00:00	133	IN_STORE	\N	0	daily	2025-10-17 13:00:02.82
323	2025-10-16 21:00:00	140	IN_STORE	\N	0	daily	2025-10-17 13:00:02.821
324	2025-10-16 21:00:00	139	IN_STORE	\N	0	daily	2025-10-17 13:00:02.821
325	2025-10-16 21:00:00	138	IN_STORE	\N	0	daily	2025-10-17 13:00:02.822
326	2025-10-16 21:00:00	137	IN_STORE	\N	0	daily	2025-10-17 13:00:02.823
327	2025-10-16 21:00:00	57	IN_STORE	\N	0	daily	2025-10-17 13:00:02.824
328	2025-10-16 21:00:00	62	IN_STORE	\N	0	daily	2025-10-17 13:00:02.824
329	2025-10-16 21:00:00	80	IN_STORE	\N	0	daily	2025-10-17 13:00:02.825
330	2025-10-16 21:00:00	68	IN_STORE	\N	0	daily	2025-10-17 13:00:02.826
331	2025-10-16 21:00:00	72	IN_STORE	\N	0	daily	2025-10-17 13:00:02.827
332	2025-10-16 21:00:00	71	IN_STORE	\N	0	daily	2025-10-17 13:00:02.828
333	2025-10-16 21:00:00	70	IN_STORE	\N	0	daily	2025-10-17 13:00:02.828
334	2025-10-16 21:00:00	69	IN_STORE	\N	0	daily	2025-10-17 13:00:02.829
335	2025-10-16 21:00:00	119	IN_STORE	\N	0	daily	2025-10-17 13:00:02.83
336	2025-10-16 21:00:00	120	IN_STORE	\N	0	daily	2025-10-17 13:00:02.831
337	2025-10-16 21:00:00	118	IN_STORE	\N	0	daily	2025-10-17 13:00:02.832
338	2025-10-16 21:00:00	117	IN_STORE	\N	0	daily	2025-10-17 13:00:02.832
339	2025-10-16 21:00:00	116	IN_STORE	\N	0	daily	2025-10-17 13:00:02.833
340	2025-10-16 21:00:00	132	IN_STORE	\N	0	daily	2025-10-17 13:00:02.834
341	2025-10-16 21:00:00	131	IN_STORE	\N	0	daily	2025-10-17 13:00:02.835
342	2025-10-16 21:00:00	153	IN_STORE	\N	0	daily	2025-10-17 13:00:02.836
343	2025-10-16 21:00:00	156	IN_STORE	\N	0	daily	2025-10-17 13:00:02.836
344	2025-10-16 21:00:00	155	IN_STORE	\N	0	daily	2025-10-17 13:00:02.837
345	2025-10-16 21:00:00	154	IN_STORE	\N	0	daily	2025-10-17 13:00:02.838
346	2025-10-16 21:00:00	23	IN_STORE	\N	0	daily	2025-10-17 13:00:02.839
\.


--
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_images (id, "productId", filename, path, "isMain", "createdAt", "githubUrl", "localPath", "storageType") FROM stdin;
1	1	RF-44836_1760433877993_1.jpg	/img/products/RF-44836/RF-44836_1760433877993_1.jpg	t	2025-10-14 09:24:37.995	\N	\N	local
2	2	603010_1760440514859_1.jpg	/img/products/603010/603010_1760440514859_1.jpg	t	2025-10-14 11:15:14.861	\N	\N	local
3	3	514412_1760441496965_1.jpg	/img/products/514412/514412_1760441496965_1.jpg	t	2025-10-14 11:31:36.967	\N	\N	local
4	4	622030_1760441908955_1.jpg	/img/products/622030/622030_1760441908955_1.jpg	t	2025-10-14 11:38:28.956	\N	\N	local
5	5	JCB-TH52002C_1760442274730_1.jpg	/img/products/JCB-TH52002C/JCB-TH52002C_1760442274730_1.jpg	t	2025-10-14 11:44:34.731	\N	\N	local
6	6	JCB-TH52002C-Part_1760442343761_1.jpg	/img/products/JCB-TH52002C-Part/JCB-TH52002C-Part_1760442343761_1.jpg	t	2025-10-14 11:45:43.762	\N	\N	local
7	7	JCB-TH52002C-Part2_1760442506678_1.jpg	/img/products/JCB-TH52002C-Part2/JCB-TH52002C-Part2_1760442506678_1.jpg	t	2025-10-14 11:48:26.68	\N	\N	local
8	8	RF-9T0801_1760443265093_1.jpg	/img/products/RF-9T0801/RF-9T0801_1760443265093_1.jpg	t	2025-10-14 12:01:05.096	\N	\N	local
9	9	PA-44740_1760443667328_1.jpg	/img/products/PA-44740/PA-44740_1760443667328_1.jpg	t	2025-10-14 12:07:47.33	\N	\N	local
10	10	RF-75713_1760443947997_1.jpg	/img/products/RF-75713/RF-75713_1760443947997_1.jpg	t	2025-10-14 12:12:27.998	\N	\N	local
11	11	RF-1747505 Premium_1760444227594_1.jpg	/img/products/RF-1747505 Premium/RF-1747505 Premium_1760444227594_1.jpg	t	2025-10-14 12:17:07.595	\N	\N	local
12	12	JCB-5457717_1760519929225_1.jpg	/img/products/JCB-5457717/JCB-5457717_1760519929225_1.jpg	t	2025-10-15 09:18:49.227	\N	\N	local
13	13	FK-4158_1760520666077_1.jpg	/img/products/FK-4158/FK-4158_1760520666077_1.jpg	t	2025-10-15 09:31:06.079	\N	\N	local
14	14	CAEA1612_1760521141213_1.jpg	/img/products/CAEA1612/CAEA1612_1760521141213_1.jpg	t	2025-10-15 09:39:01.215	\N	\N	local
15	15	805382_1760521627041_1.jpg	/img/products/805382/805382_1760521627041_1.jpg	t	2025-10-15 09:47:07.044	\N	\N	local
16	16	825206_1760523240121_1.jpg	/img/products/825206/825206_1760523240121_1.jpg	t	2025-10-15 10:14:00.122	\N	\N	local
17	17	321321_1760524946296_1.jpg	/img/products/321321/321321_1760524946296_1.jpg	t	2025-10-15 10:42:26.298	\N	\N	local
18	19	274300_1760525885021_1.jpg	/img/products/274300/274300_1760525885021_1.jpg	t	2025-10-15 10:58:05.022	\N	\N	local
19	21	44019_1760526976180_1.jpg	/img/products/44019/44019_1760526976180_1.jpg	t	2025-10-15 11:16:16.181	\N	\N	local
20	22	800410_1760527351198_1.jpg	/img/products/800410/800410_1760527351198_1.jpg	t	2025-10-15 11:22:31.199	\N	\N	local
21	23	F-BSE1-3SM_1760528002672_1.jpg	/img/products/F-BSE1-3SM/F-BSE1-3SM_1760528002672_1.jpg	t	2025-10-15 11:33:22.673	\N	\N	local
22	25	563592_1760602872238_1.jpg	/img/products/563592/563592_1760602872238_1.jpg	t	2025-10-16 08:21:12.24	\N	\N	local
23	27	RF-802222_1760604699615_1.jpg	/img/products/RF-802222/RF-802222_1760604699615_1.jpg	t	2025-10-16 08:51:39.617	\N	\N	local
24	28	RF-41082-5L EURO_1760605447717_1.jpg	/img/products/RF-41082-5L EURO/RF-41082-5L EURO_1760605447717_1.jpg	t	2025-10-16 09:04:07.719	\N	\N	local
25	29	BCDA1617_1760605885954_1.jpg	/img/products/BCDA1617/BCDA1617_1760605885954_1.jpg	t	2025-10-16 09:11:25.955	\N	\N	local
26	30	1787512_1760606415380_1.jpg	/img/products/1787512/1787512_1760606415380_1.jpg	t	2025-10-16 09:20:15.382	\N	\N	local
27	31	F-61804_1760607019404_1.jpg	/img/products/F-61804/F-61804_1760607019404_1.jpg	t	2025-10-16 09:30:19.406	\N	\N	local
28	32	610 008_1760684139309_1.jpg	/img/products/610 008/610 008_1760684139309_1.jpg	t	2025-10-17 06:55:39.311	\N	\N	local
29	33	JGAW0501_1760684686475_1.jpg	/img/products/JGAW0501/JGAW0501_1760684686475_1.jpg	t	2025-10-17 07:04:46.476	\N	\N	local
30	34	270038_1760685354358_1.jpg	/img/products/270038/270038_1760685354358_1.jpg	t	2025-10-17 07:15:54.359	\N	\N	local
31	35	Sch-TAP10x1,25_1760689313948_1.jpg	/img/products/Sch-TAP10x1,25/Sch-TAP10x1,25_1760689313948_1.jpg	t	2025-10-17 08:21:53.95	\N	\N	local
32	36	F-9U0102_1760693966646_1.jpg	/img/products/F-9U0102/F-9U0102_1760693966646_1.jpg	t	2025-10-17 09:39:26.648	\N	\N	local
33	37	816105_1760694577021_1.jpg	/img/products/816105/816105_1760694577021_1.jpg	t	2025-10-17 09:49:37.023	\N	\N	local
34	38	RF-1022-34_1760695745583_1.jpg	/img/products/RF-1022-34/RF-1022-34_1760695745583_1.jpg	t	2025-10-17 10:09:05.585	\N	\N	local
35	39	PRO-83008_1760696047999_1.jpg	/img/products/PRO-83008/PRO-83008_1760696047999_1.jpg	t	2025-10-17 10:14:08.001	\N	\N	local
36	40	F-34012829_1760768274085_1.jpg	/img/products/F-34012829/F-34012829_1760768274085_1.jpg	t	2025-10-18 06:17:54.087	\N	\N	local
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
1	1	SYSTEM	Unit автоматически создан из продукта Головка ударная 36мм (12гр.), 1/2''	\N	2025-10-14 09:24:43.233
2	1	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-14 09:24:59.572
3	2	SYSTEM	CLEAR unit создан как замена для кандидата #RF-44836-20251014-122443231-921881	{"purpose": "replacement_for_candidate", "sourceUnitId": 1, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "RF-44836-20251014-122443231-921881"}	2025-10-14 09:27:48.343
4	1	IN_REQUEST	Создана одиночная заявка, цена: 5.64	{"pricePerUnit": 5.64, "clearReplacementUnitId": 2}	2025-10-14 09:27:48.35
5	1	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 09:28:05.305
6	1	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 09:28:05.308
7	1	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 09:28:05.311
8	1	SALE	Товар продан за 12 ₽	{"isCredit": false, "buyerName": "", "salePrice": 12, "buyerPhone": ""}	2025-10-14 09:30:56.712
9	3	SYSTEM	Unit автоматически создан из продукта Головка TORX E10 1/4"	\N	2025-10-14 11:15:45.644
10	3	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-14 11:17:12.437
11	4	SYSTEM	CLEAR unit создан как замена для кандидата #603010-20251014-141545642-385683	{"purpose": "replacement_for_candidate", "sourceUnitId": 3, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "603010-20251014-141545642-385683"}	2025-10-14 11:17:31.736
12	3	SPROUTED	Unit преобразован в SPROUTED для создания 11 дочерних заявок	{"pricePerUnit": 1.38, "childrenCount": 11}	2025-10-14 11:17:31.741
13	5	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 1, "parentUnitId": 3}	2025-10-14 11:17:31.745
14	6	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 2, "parentUnitId": 3}	2025-10-14 11:17:31.749
15	7	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 3, "parentUnitId": 3}	2025-10-14 11:17:31.752
16	8	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 4, "parentUnitId": 3}	2025-10-14 11:17:31.755
17	9	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 5, "parentUnitId": 3}	2025-10-14 11:17:31.758
18	10	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 6, "parentUnitId": 3}	2025-10-14 11:17:31.761
19	11	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 7, "parentUnitId": 3}	2025-10-14 11:17:31.764
20	12	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 8, "parentUnitId": 3}	2025-10-14 11:17:31.767
21	13	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 9, "parentUnitId": 3}	2025-10-14 11:17:31.77
22	14	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 10, "parentUnitId": 3}	2025-10-14 11:17:31.773
23	15	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 11, "parentUnitId": 3}	2025-10-14 11:17:31.776
24	5	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 11:19:25.5
25	5	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 11:19:25.502
26	5	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 11:19:25.504
27	6	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 11:19:27.819
28	6	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 11:19:27.821
29	6	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 11:19:27.823
30	7	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 11:19:29.521
31	7	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 11:19:29.523
32	7	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 11:19:29.525
33	8	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 11:19:31.297
34	8	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 11:19:31.299
35	8	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 11:19:31.301
36	9	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 11:19:32.744
37	9	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 11:19:32.746
38	9	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 11:19:32.748
39	10	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 11:19:34.075
40	10	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 11:19:34.077
41	10	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 11:19:34.079
42	11	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 11:19:35.259
43	11	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 11:19:35.262
44	11	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 11:19:35.264
45	12	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 11:19:38.002
46	12	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 11:19:38.004
47	12	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 11:19:38.007
48	13	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 11:19:39.964
49	13	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 11:19:39.968
50	13	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 11:19:39.97
51	14	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 11:19:42.197
52	14	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 11:19:42.199
53	14	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 11:19:42.201
54	15	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 11:19:43.795
55	15	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 11:19:43.797
56	15	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 11:19:43.799
57	15	SALE	Товар продан за 5 ₽	{"isCredit": false, "buyerName": "", "salePrice": 5, "buyerPhone": ""}	2025-10-14 11:20:13.1
58	16	SYSTEM	Unit автоматически создан из продукта Ключ накидной TORX Е10×Е12	\N	2025-10-14 11:32:00.931
59	16	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-14 11:32:12.082
60	17	SYSTEM	CLEAR unit создан как замена для кандидата #514412-20251014-143200930-317103	{"purpose": "replacement_for_candidate", "sourceUnitId": 16, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "514412-20251014-143200930-317103"}	2025-10-14 11:32:48.069
61	16	SPROUTED	Unit преобразован в SPROUTED для создания 2 дочерних заявок	{"pricePerUnit": 8.22, "childrenCount": 2}	2025-10-14 11:32:48.075
62	18	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 1, "parentUnitId": 16}	2025-10-14 11:32:48.078
63	19	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 2, "parentUnitId": 16}	2025-10-14 11:32:48.082
64	18	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 11:32:55.376
65	18	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 11:32:55.379
66	18	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 11:32:55.381
67	18	SALE	Товар продан за 8.22 ₽	{"isCredit": false, "buyerName": "", "salePrice": 8.22, "buyerPhone": ""}	2025-10-14 11:33:22.987
68	18	RETURN	Товар возвращен. Причина: Возврат товара	{"returnReason": "Возврат товара", "previousStatus": "SOLD", "previousSalePrice": 8.22}	2025-10-14 11:33:43.745
69	18	SALE	Товар продан за 12 ₽	{"isCredit": false, "buyerName": "", "salePrice": 12, "buyerPhone": ""}	2025-10-14 11:34:34.173
70	20	SYSTEM	Unit автоматически создан из продукта Головка двенадцатигранная 30мм 1/2"	\N	2025-10-14 11:38:45.12
71	20	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-14 11:38:53.846
72	21	SYSTEM	CLEAR unit создан как замена для кандидата #622030-20251014-143845118-408920	{"purpose": "replacement_for_candidate", "sourceUnitId": 20, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "622030-20251014-143845118-408920"}	2025-10-14 11:39:18.584
73	20	SPROUTED	Unit преобразован в SPROUTED для создания 2 дочерних заявок	{"pricePerUnit": 7.26, "childrenCount": 2}	2025-10-14 11:39:18.599
74	22	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 1, "parentUnitId": 20}	2025-10-14 11:39:18.603
75	23	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 2, "parentUnitId": 20}	2025-10-14 11:39:18.606
76	22	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 11:39:28.137
77	22	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 11:39:28.139
78	22	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 11:39:28.141
79	22	SALE	Товар продан за 10 ₽	{"isCredit": false, "buyerName": "", "salePrice": 10, "buyerPhone": ""}	2025-10-14 11:39:54.977
80	24	SYSTEM	Unit автоматически создан из продукта Подставка ремонтная 2т (h min 278mm, h max 425mm), к-т 2шт	\N	2025-10-14 11:45:59.636
81	24	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-14 11:46:09.349
82	25	SYSTEM	CLEAR unit создан как замена для кандидата #JCB-TH52002C-20251014-144559634-461770	{"purpose": "replacement_for_candidate", "sourceUnitId": 24, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "JCB-TH52002C-20251014-144559634-461770"}	2025-10-14 11:46:25.408
83	24	IN_REQUEST	Создана одиночная заявка, цена: 59.97	{"pricePerUnit": 59.97, "clearReplacementUnitId": 25}	2025-10-14 11:46:25.413
84	24	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 11:46:42.398
85	24	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 11:46:42.401
86	24	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 11:46:42.403
87	24	DISASSEMBLY_OPERATION	Выполнена разборка. Родитель: 24, Сценарий: 1	{"operation": "disassembly", "timestamp": "2025-10-14T11:49:30.894Z", "scenarioId": 1, "parentUnitId": 24, "childProductCodes": ["JCB-TH52002C-Part", "JCB-TH52002C-Part2"], "parentProductCode": "JCB-TH52002C"}	2025-10-14 11:49:30.895
88	26	DISASSEMBLY_OPERATION	Выполнена разборка. Родитель: 24, Сценарий: 1	{"operation": "disassembly", "timestamp": "2025-10-14T11:49:30.923Z", "scenarioId": 1, "parentUnitId": 24, "childProductCodes": ["JCB-TH52002C-Part", "JCB-TH52002C-Part2"], "parentProductCode": "JCB-TH52002C"}	2025-10-14 11:49:30.924
89	27	DISASSEMBLY_OPERATION	Выполнена разборка. Родитель: 24, Сценарий: 1	{"operation": "disassembly", "timestamp": "2025-10-14T11:49:30.925Z", "scenarioId": 1, "parentUnitId": 24, "childProductCodes": ["JCB-TH52002C-Part", "JCB-TH52002C-Part2"], "parentProductCode": "JCB-TH52002C"}	2025-10-14 11:49:30.926
90	27	SALE	Товар продан за 40 ₽	{"isCredit": false, "buyerName": "", "salePrice": 40, "buyerPhone": ""}	2025-10-14 11:49:57.089
91	28	SYSTEM	Unit автоматически создан из продукта Съемник рулевых тяг универсальный 27-42мм, 1/2''	\N	2025-10-14 12:01:13.726
92	28	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-14 12:01:22.645
93	29	SYSTEM	CLEAR unit создан как замена для кандидата #RF-9T0801-20251014-150113724-816881	{"purpose": "replacement_for_candidate", "sourceUnitId": 28, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "RF-9T0801-20251014-150113724-816881"}	2025-10-14 12:02:50.742
94	28	IN_REQUEST	Создана одиночная заявка, цена: 10.92	{"pricePerUnit": 10.92, "clearReplacementUnitId": 29}	2025-10-14 12:02:50.756
95	28	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 12:03:36.601
96	28	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 12:03:36.604
97	28	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 12:03:36.608
98	28	SALE	Товар продан за 25 ₽	{"isCredit": false, "buyerName": "", "salePrice": 25, "buyerPhone": ""}	2025-10-14 12:03:55.15
99	28	RETURN	Товар возвращен. Причина: Возврат товара	{"returnReason": "Возврат товара", "previousStatus": "SOLD", "previousSalePrice": 25}	2025-10-14 12:04:07.787
100	30	SYSTEM	Unit автоматически создан из продукта Сверло ступенчатое HSS 4241(4-32мм), в блистере	\N	2025-10-14 12:07:53.497
101	30	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-14 12:08:02.608
102	31	SYSTEM	CLEAR unit создан как замена для кандидата #PA-44740-20251014-150753496-311876	{"purpose": "replacement_for_candidate", "sourceUnitId": 30, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "PA-44740-20251014-150753496-311876"}	2025-10-14 12:08:16.324
103	30	IN_REQUEST	Создана одиночная заявка, цена: 20.4	{"pricePerUnit": 20.4, "clearReplacementUnitId": 31}	2025-10-14 12:08:16.337
104	30	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 12:08:32.66
105	30	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 12:08:32.662
106	30	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 12:08:32.664
107	30	SALE	Товар продан за 25 ₽	{"isCredit": false, "buyerName": "", "salePrice": 25, "buyerPhone": ""}	2025-10-14 12:08:58.92
108	31	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-14 12:09:33.467
109	32	SYSTEM	Unit автоматически создан из продукта Ключ комбинированный трещоточный 13мм	\N	2025-10-14 12:12:41.238
110	32	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-14 12:12:52.852
111	33	SYSTEM	CLEAR unit создан как замена для кандидата #RF-75713-20251014-151241236-575125	{"purpose": "replacement_for_candidate", "sourceUnitId": 32, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "RF-75713-20251014-151241236-575125"}	2025-10-14 12:13:25.225
112	32	IN_REQUEST	Создана одиночная заявка, цена: 9.69	{"pricePerUnit": 9.69, "clearReplacementUnitId": 33}	2025-10-14 12:13:25.237
113	32	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 12:13:34.821
114	32	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 12:13:34.824
115	32	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 12:13:34.826
116	32	SALE	Товар продан за 14 ₽	{"isCredit": false, "buyerName": "", "salePrice": 14, "buyerPhone": ""}	2025-10-14 12:14:02.319
117	34	SYSTEM	Unit автоматически создан из продукта Бита 6-гранная H5х75ммL,10мм	\N	2025-10-14 12:17:13.407
118	34	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-14 12:17:30.544
119	35	SYSTEM	CLEAR unit создан как замена для кандидата #RF-1747505 Premium-20251014-151713406-466685	{"purpose": "replacement_for_candidate", "sourceUnitId": 34, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "RF-1747505 Premium-20251014-151713406-466685"}	2025-10-14 12:25:21.337
120	34	SPROUTED	Unit преобразован в SPROUTED для создания 11 дочерних заявок	{"pricePerUnit": 2.34, "childrenCount": 11}	2025-10-14 12:25:21.342
121	36	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 1, "parentUnitId": 34}	2025-10-14 12:25:21.345
122	37	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 2, "parentUnitId": 34}	2025-10-14 12:25:21.349
123	38	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 3, "parentUnitId": 34}	2025-10-14 12:25:21.352
124	39	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 4, "parentUnitId": 34}	2025-10-14 12:25:21.355
125	40	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 5, "parentUnitId": 34}	2025-10-14 12:25:21.358
126	41	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 6, "parentUnitId": 34}	2025-10-14 12:25:21.361
127	42	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 7, "parentUnitId": 34}	2025-10-14 12:25:21.364
128	43	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 8, "parentUnitId": 34}	2025-10-14 12:25:21.367
129	44	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 9, "parentUnitId": 34}	2025-10-14 12:25:21.37
130	45	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 10, "parentUnitId": 34}	2025-10-14 12:25:21.373
131	46	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 11, "sequence": 11, "parentUnitId": 34}	2025-10-14 12:25:21.375
132	19	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 12:25:31.637
133	19	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 12:25:31.64
134	19	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 12:25:31.643
135	23	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 12:25:37.788
136	23	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 12:25:37.79
137	23	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 12:25:37.792
138	36	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 12:26:00.058
139	36	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 12:26:00.06
140	36	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 12:26:00.062
141	37	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 12:26:04.112
142	37	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 12:26:04.114
143	37	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 12:26:04.115
144	38	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 12:26:06.911
145	38	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 12:26:06.913
146	38	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 12:26:06.915
147	39	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 12:26:08.876
148	39	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 12:26:08.878
149	39	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 12:26:08.882
150	40	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 12:26:10.542
151	40	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 12:26:10.545
152	40	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 12:26:10.546
153	41	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 12:26:12.411
154	41	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 12:26:12.413
155	41	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 12:26:12.414
156	42	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 12:26:14.143
157	42	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 12:26:14.145
158	42	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 12:26:14.146
159	43	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 12:26:16.609
160	43	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 12:26:16.611
161	43	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 12:26:16.613
162	44	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 12:26:18.484
163	44	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 12:26:18.49
164	44	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 12:26:18.492
165	45	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 12:26:20.21
166	45	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 12:26:20.212
167	45	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 12:26:20.214
168	46	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-14 12:26:23.239
169	46	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-14 12:26:23.242
170	46	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-14 12:26:23.244
171	23	STATUS_CHANGE	Откат статуса: IN_STORE → IN_REQUEST (возврат в запрос)	{"timestamp": "2025-10-14T12:48:22.807Z", "newCardStatus": "IN_REQUEST", "newProductStatus": null, "previousCardStatus": "ARRIVED", "previousProductStatus": "IN_STORE"}	2025-10-14 12:48:22.808
172	47	SYSTEM	Unit автоматически создан из продукта Головка глубокая 17мм (6гр.), 1/2''	\N	2025-10-15 09:19:20.271
173	47	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-15 09:19:33.821
175	47	IN_REQUEST	Создана одиночная заявка, цена: 3.06	{"pricePerUnit": 3.06, "clearReplacementUnitId": 48}	2025-10-15 09:19:53.799
176	47	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-15 09:20:07.189
174	48	SYSTEM	CLEAR unit создан как замена для кандидата #JCB-5457717-20251015-121920270-239709	{"purpose": "replacement_for_candidate", "sourceUnitId": 47, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "JCB-5457717-20251015-121920270-239709"}	2025-10-15 09:19:53.795
319	103	SYSTEM	Unit автоматически создан из продукта Набор ключей TORX с отверстием удлинённых 9шт.	\N	2025-10-16 08:22:17.817
320	103	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-16 08:22:33.894
322	81	SPROUTED	Unit преобразован в SPROUTED для создания 2 дочерних заявок	{"pricePerUnit": 15.9, "childrenCount": 2}	2025-10-16 08:26:26.839
323	105	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 1, "parentUnitId": 81}	2025-10-16 08:26:26.859
324	106	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 2, "parentUnitId": 81}	2025-10-16 08:26:26.865
325	107	SYSTEM	Unit автоматически создан из продукта Набор ключей TORX с отверстием удлинённых 9шт.	\N	2025-10-16 08:27:24.037
327	103	SPROUTED	Unit преобразован в SPROUTED для создания 2 дочерних заявок	{"pricePerUnit": 15.42, "childrenCount": 2}	2025-10-16 08:28:16.504
328	109	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 1, "parentUnitId": 103}	2025-10-16 08:28:16.506
329	110	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 2, "parentUnitId": 103}	2025-10-16 08:28:16.51
330	109	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-16 08:28:38.398
331	109	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-16 08:28:38.401
332	109	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-16 08:28:38.403
333	110	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-16 08:28:42.13
334	110	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-16 08:28:42.133
335	110	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-16 08:28:42.135
336	108	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-16 08:29:14.974
337	111	SYSTEM	CLEAR unit создан как замена для кандидата #563592-20251016-112816497-998228	{"purpose": "replacement_for_candidate", "sourceUnitId": 108, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "563592-20251016-112816497-998228"}	2025-10-16 08:29:46.672
338	108	SPROUTED	Unit преобразован в SPROUTED для создания 2 дочерних заявок	{"pricePerUnit": 15.9, "childrenCount": 2}	2025-10-16 08:29:46.678
339	112	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 1, "parentUnitId": 108}	2025-10-16 08:29:46.68
340	113	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 2, "parentUnitId": 108}	2025-10-16 08:29:46.683
343	115	SYSTEM	CLEAR unit создан как замена для кандидата #622019-20251016-114535576-447764	{"purpose": "replacement_for_candidate", "sourceUnitId": 114, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "622019-20251016-114535576-447764"}	2025-10-16 08:46:36.65
360	118	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-16 08:46:58.208
361	118	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-16 08:46:58.21
362	118	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-16 08:46:58.212
363	117	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-16 08:47:01.132
364	117	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-16 08:47:01.134
365	117	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-16 08:47:01.136
366	116	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-16 08:47:03.601
367	116	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-16 08:47:03.603
368	116	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-16 08:47:03.605
369	113	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-16 08:47:06.544
370	113	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-16 08:47:06.545
371	113	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-16 08:47:06.547
372	112	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-16 08:47:08.829
373	112	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-16 08:47:08.831
374	112	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-16 08:47:08.833
375	109	STATUS_CHANGE	Откат статуса: IN_STORE → IN_REQUEST (возврат в запрос)	{"timestamp": "2025-10-16T08:47:39.104Z", "newCardStatus": "IN_REQUEST", "newProductStatus": null, "previousCardStatus": "ARRIVED", "previousProductStatus": "IN_STORE"}	2025-10-16 08:47:39.105
376	110	STATUS_CHANGE	Откат статуса: IN_STORE → IN_REQUEST (возврат в запрос)	{"timestamp": "2025-10-16T08:47:47.418Z", "newCardStatus": "IN_REQUEST", "newProductStatus": null, "previousCardStatus": "ARRIVED", "previousProductStatus": "IN_STORE"}	2025-10-16 08:47:47.419
377	121	SALE	Товар продан за 7 ₽	{"isCredit": false, "buyerName": "", "salePrice": 7, "buyerPhone": ""}	2025-10-16 08:49:02.564
378	122	SYSTEM	Unit автоматически создан из продукта Трещотка реверсивная усиленная изогнутая с резиновой ручкой 1/4''(72зуб.)	\N	2025-10-16 08:54:19.555
177	47	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-15 09:20:07.191
178	47	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-15 09:20:07.194
179	47	SALE	Товар продан за 8 ₽	{"isCredit": false, "buyerName": "", "salePrice": 8, "buyerPhone": ""}	2025-10-15 09:20:40.43
180	49	SYSTEM	Unit автоматически создан из продукта Набор головок Е-профиль,14пр(1/4'':Е4,5,6,7,8, 3/8:Е10,11,12,14, 1/2'':Е16,18,20,22,24),на планке	\N	2025-10-15 09:31:26.578
181	49	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-15 09:31:35.191
182	50	SYSTEM	CLEAR unit создан как замена для кандидата #FK-4158-20251015-123126577-697238	{"purpose": "replacement_for_candidate", "sourceUnitId": 49, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "FK-4158-20251015-123126577-697238"}	2025-10-15 09:31:51.058
183	49	IN_REQUEST	Создана одиночная заявка, цена: 22.5	{"pricePerUnit": 22.5, "clearReplacementUnitId": 50}	2025-10-15 09:31:51.071
184	49	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-15 09:32:02.457
185	49	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-15 09:32:02.459
186	49	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-15 09:32:02.461
187	49	SALE	Товар продан за 35 ₽	{"isCredit": false, "buyerName": "", "salePrice": 35, "buyerPhone": ""}	2025-10-15 09:32:32.411
188	51	SYSTEM	Unit автоматически создан из продукта Переходник 1/2"(F)х3/8(М) TOPTUL	\N	2025-10-15 09:39:31.182
189	51	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-15 09:39:47.648
190	52	SYSTEM	CLEAR unit создан как замена для кандидата #CAEA1612-20251015-123931181-383215	{"purpose": "replacement_for_candidate", "sourceUnitId": 51, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "CAEA1612-20251015-123931181-383215"}	2025-10-15 09:40:05.536
191	51	IN_REQUEST	Создана одиночная заявка, цена: 3.77	{"pricePerUnit": 3.77, "clearReplacementUnitId": 52}	2025-10-15 09:40:05.549
192	51	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-15 09:41:14.673
193	51	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-15 09:41:14.675
194	51	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-15 09:41:14.678
195	51	SALE	Товар продан за 5 ₽	{"isCredit": false, "buyerName": "", "salePrice": 5, "buyerPhone": ""}	2025-10-15 09:41:46.275
196	53	SYSTEM	Unit автоматически создан из продукта Ключ шкива коленвала 36×38 мм (112171)	\N	2025-10-15 09:47:19.212
197	53	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-15 09:47:27.174
198	54	SYSTEM	CLEAR unit создан как замена для кандидата #805382-20251015-124719211-981420	{"purpose": "replacement_for_candidate", "sourceUnitId": 53, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "805382-20251015-124719211-981420"}	2025-10-15 09:48:24.455
199	53	IN_REQUEST	Создана одиночная заявка, цена: 14.58	{"pricePerUnit": 14.58, "clearReplacementUnitId": 54}	2025-10-15 09:48:24.469
200	53	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-15 09:48:32.358
201	53	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-15 09:48:32.36
202	53	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-15 09:48:32.362
203	53	SALE	Товар продан за 20 ₽	{"isCredit": false, "buyerName": "", "salePrice": 20, "buyerPhone": ""}	2025-10-15 09:49:52.167
204	54	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-15 09:54:39.173
205	55	SYSTEM	CLEAR unit создан как замена для кандидата #805382-20251015-124824453-050655	{"purpose": "replacement_for_candidate", "sourceUnitId": 54, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "805382-20251015-124824453-050655"}	2025-10-15 09:54:55.824
206	54	IN_REQUEST	Создана одиночная заявка, цена: 14.58	{"pricePerUnit": 14.58, "clearReplacementUnitId": 55}	2025-10-15 09:54:55.829
207	52	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-15 10:00:29.753
208	56	SYSTEM	CLEAR unit создан как замена для кандидата #CAEA1612-20251015-124005534-983581	{"purpose": "replacement_for_candidate", "sourceUnitId": 52, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "CAEA1612-20251015-124005534-983581"}	2025-10-15 10:01:59.695
209	52	SPROUTED	Unit преобразован в SPROUTED для создания 3 дочерних заявок	{"pricePerUnit": 3.37, "childrenCount": 3}	2025-10-15 10:01:59.711
210	57	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 1, "parentUnitId": 52}	2025-10-15 10:01:59.714
211	58	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 2, "parentUnitId": 52}	2025-10-15 10:01:59.718
212	59	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 3, "parentUnitId": 52}	2025-10-15 10:01:59.721
213	57	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-15 10:02:52.876
214	57	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-15 10:02:52.879
215	57	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-15 10:02:52.881
216	60	SYSTEM	Unit автоматически создан из продукта Съёмник пистонов обшивки изогнутый 6мм	\N	2025-10-15 10:14:11.119
217	60	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-15 10:14:36.045
218	61	SYSTEM	CLEAR unit создан как замена для кандидата #825206-20251015-131411118-777838	{"purpose": "replacement_for_candidate", "sourceUnitId": 60, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "825206-20251015-131411118-777838"}	2025-10-15 10:17:17.025
219	60	SPROUTED	Unit преобразован в SPROUTED для создания 4 дочерних заявок	{"pricePerUnit": 5.76, "childrenCount": 4}	2025-10-15 10:17:17.031
220	62	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 4, "sequence": 1, "parentUnitId": 60}	2025-10-15 10:17:17.034
221	63	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 4, "sequence": 2, "parentUnitId": 60}	2025-10-15 10:17:17.038
222	64	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 4, "sequence": 3, "parentUnitId": 60}	2025-10-15 10:17:17.041
223	65	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 4, "sequence": 4, "parentUnitId": 60}	2025-10-15 10:17:17.044
224	65	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-15 10:17:49.005
225	65	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-15 10:17:49.007
226	65	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-15 10:17:49.009
227	64	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-15 10:17:53.789
228	64	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-15 10:17:53.791
229	64	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-15 10:17:53.793
230	63	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-15 10:17:56.587
231	63	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-15 10:17:56.589
232	63	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-15 10:17:56.591
233	62	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-15 10:17:59.86
234	62	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-15 10:17:59.862
235	62	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-15 10:17:59.864
236	65	SALE	Товар продан за 10 ₽	{"isCredit": false, "buyerName": "", "salePrice": 10, "buyerPhone": ""}	2025-10-15 10:18:34.806
237	64	STATUS_CHANGE	Откат статуса: IN_STORE → IN_REQUEST (возврат в запрос)	{"timestamp": "2025-10-15T10:19:33.039Z", "newCardStatus": "IN_REQUEST", "newProductStatus": null, "previousCardStatus": "ARRIVED", "previousProductStatus": "IN_STORE"}	2025-10-15 10:19:33.04
238	63	STATUS_CHANGE	Откат статуса: IN_STORE → IN_REQUEST (возврат в запрос)	{"timestamp": "2025-10-15T10:19:42.657Z", "newCardStatus": "IN_REQUEST", "newProductStatus": null, "previousCardStatus": "ARRIVED", "previousProductStatus": "IN_STORE"}	2025-10-15 10:19:42.658
239	66	SYSTEM	Unit автоматически создан из продукта Головка-бита Philips PH.1 1/4'' FORCE 321321	\N	2025-10-15 10:42:31.711
240	66	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-15 10:42:43.965
241	67	SYSTEM	CLEAR unit создан как замена для кандидата #321321-20251015-134231709-235483	{"purpose": "replacement_for_candidate", "sourceUnitId": 66, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "321321-20251015-134231709-235483"}	2025-10-15 10:43:44.591
242	66	SPROUTED	Unit преобразован в SPROUTED для создания 5 дочерних заявок	{"pricePerUnit": 2.16, "childrenCount": 5}	2025-10-15 10:43:44.606
243	68	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 1, "parentUnitId": 66}	2025-10-15 10:43:44.609
244	69	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 2, "parentUnitId": 66}	2025-10-15 10:43:44.612
245	70	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 3, "parentUnitId": 66}	2025-10-15 10:43:44.615
246	71	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 4, "parentUnitId": 66}	2025-10-15 10:43:44.618
247	72	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 5, "sequence": 5, "parentUnitId": 66}	2025-10-15 10:43:44.62
248	72	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-15 10:43:59.298
249	72	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-15 10:43:59.3
250	72	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-15 10:43:59.302
251	71	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-15 10:44:01.963
252	71	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-15 10:44:01.966
253	71	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-15 10:44:01.968
254	70	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-15 10:44:04.227
255	70	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-15 10:44:04.229
256	70	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-15 10:44:04.231
257	69	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-15 10:44:06.566
258	69	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-15 10:44:06.568
259	69	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-15 10:44:06.57
260	68	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-15 10:44:09.065
261	68	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-15 10:44:09.067
262	68	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-15 10:44:09.069
263	73	SYSTEM	Unit автоматически создан из продукта Головка-бита Pozidriv PZ.2 1/4'' FORCE 322322	\N	2025-10-15 10:46:44.385
264	73	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-15 10:47:00.864
265	74	SYSTEM	CLEAR unit создан как замена для кандидата #322322-20251015-134644384-566058	{"purpose": "replacement_for_candidate", "sourceUnitId": 73, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "322322-20251015-134644384-566058"}	2025-10-15 10:47:49.382
266	73	SPROUTED	Unit преобразован в SPROUTED для создания 6 дочерних заявок	{"pricePerUnit": 2.16, "childrenCount": 6}	2025-10-15 10:47:49.396
267	75	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 6, "sequence": 1, "parentUnitId": 73}	2025-10-15 10:47:49.399
268	76	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 6, "sequence": 2, "parentUnitId": 73}	2025-10-15 10:47:49.402
269	77	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 6, "sequence": 3, "parentUnitId": 73}	2025-10-15 10:47:49.406
270	78	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 6, "sequence": 4, "parentUnitId": 73}	2025-10-15 10:47:49.409
271	79	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 6, "sequence": 5, "parentUnitId": 73}	2025-10-15 10:47:49.412
272	80	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 6, "sequence": 6, "parentUnitId": 73}	2025-10-15 10:47:49.414
273	80	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-15 10:47:58.765
274	80	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-15 10:47:58.768
275	80	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-15 10:47:58.77
276	81	SYSTEM	Unit автоматически создан из продукта Щётка для УШМ проволочная конусная 100мм	\N	2025-10-15 10:58:13.837
277	82	SYSTEM	Unit автоматически создан из продукта Щётка для УШМ проволочная конусная 100мм	\N	2025-10-15 10:59:16.952
278	81	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-15 10:59:35.642
279	82	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-15 10:59:52.704
280	83	SYSTEM	CLEAR unit создан как замена для кандидата #274300-20251015-135916951-099046	{"purpose": "replacement_for_candidate", "sourceUnitId": 82, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "274300-20251015-135916951-099046"}	2025-10-15 11:00:18.802
281	82	SPROUTED	Unit преобразован в SPROUTED для создания 3 дочерних заявок	{"pricePerUnit": 8.04, "childrenCount": 3}	2025-10-15 11:00:18.817
282	84	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 1, "parentUnitId": 82}	2025-10-15 11:00:18.82
283	85	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 2, "parentUnitId": 82}	2025-10-15 11:00:18.823
284	86	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 3, "parentUnitId": 82}	2025-10-15 11:00:18.828
285	87	SYSTEM	Unit автоматически создан из продукта Щётка для УШМ проволочная конусная 125мм	\N	2025-10-15 11:02:49.887
286	87	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-15 11:03:01.872
287	88	SYSTEM	CLEAR unit создан как замена для кандидата #274325-20251015-140249886-781428	{"purpose": "replacement_for_candidate", "sourceUnitId": 87, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "274325-20251015-140249886-781428"}	2025-10-15 11:03:54.177
288	87	SPROUTED	Unit преобразован в SPROUTED для создания 3 дочерних заявок	{"pricePerUnit": 10.5, "childrenCount": 3}	2025-10-15 11:03:54.19
289	89	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 1, "parentUnitId": 87}	2025-10-15 11:03:54.193
290	90	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 2, "parentUnitId": 87}	2025-10-15 11:03:54.196
291	91	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 3, "parentUnitId": 87}	2025-10-15 11:03:54.199
292	92	SYSTEM	Unit автоматически создан из продукта Набор щеток зачистных для дрели 3 шт., 25/50/50 мм АвтоDело 44019 10276	\N	2025-10-15 11:16:59.067
293	92	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-15 11:17:12.364
294	93	SYSTEM	CLEAR unit создан как замена для кандидата #44019-20251015-141659065-235687	{"purpose": "replacement_for_candidate", "sourceUnitId": 92, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "44019-20251015-141659065-235687"}	2025-10-15 11:17:51.244
295	92	SPROUTED	Unit преобразован в SPROUTED для создания 3 дочерних заявок	{"pricePerUnit": 7.02, "childrenCount": 3}	2025-10-15 11:17:51.258
296	94	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 1, "parentUnitId": 92}	2025-10-15 11:17:51.261
297	95	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 2, "parentUnitId": 92}	2025-10-15 11:17:51.264
298	96	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 3, "parentUnitId": 92}	2025-10-15 11:17:51.268
299	97	SYSTEM	Unit автоматически создан из продукта Съёмник масляных фильтров ременной Ø60-140 мм	\N	2025-10-15 11:22:38.981
300	97	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-15 11:22:49.762
301	98	SYSTEM	CLEAR unit создан как замена для кандидата #800410-20251015-142238980-405970	{"purpose": "replacement_for_candidate", "sourceUnitId": 97, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "800410-20251015-142238980-405970"}	2025-10-15 11:23:37.186
302	97	IN_REQUEST	Создана одиночная заявка, цена: 35.52	{"pricePerUnit": 35.52, "clearReplacementUnitId": 98}	2025-10-15 11:23:37.199
303	99	SYSTEM	Unit автоматически создан из продукта Быстроразъем пневматический с клапаном-наружняя резьба 3/8''	\N	2025-10-15 11:33:38.464
304	99	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-15 11:33:47.083
305	100	SYSTEM	CLEAR unit создан как замена для кандидата #F-BSE1-3SM-20251015-143338462-357900	{"purpose": "replacement_for_candidate", "sourceUnitId": 99, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "F-BSE1-3SM-20251015-143338462-357900"}	2025-10-15 11:34:10.846
306	99	IN_REQUEST	Создана одиночная заявка, цена: 11.4	{"pricePerUnit": 11.4, "clearReplacementUnitId": 100}	2025-10-15 11:34:10.859
307	99	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-15 11:34:57.058
308	99	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-15 11:34:57.06
309	99	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-15 11:34:57.062
310	99	SALE	Товар продан за 14 ₽	{"isCredit": false, "buyerName": "", "salePrice": 14, "buyerPhone": ""}	2025-10-15 11:35:27.808
311	101	SYSTEM	Unit автоматически создан из продукта Набор инструментов 216пр. 1/4'', 3/8'', 1/2''(6гр.)(4-32мм)	\N	2025-10-15 12:43:43.002
312	101	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-15 12:43:52.953
313	102	SYSTEM	CLEAR unit создан как замена для кандидата #JCB-38841-20251015-154343000-917559	{"purpose": "replacement_for_candidate", "sourceUnitId": 101, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "JCB-38841-20251015-154343000-917559"}	2025-10-15 12:44:25.668
314	101	IN_REQUEST	Создана одиночная заявка, цена: 195	{"pricePerUnit": 195, "clearReplacementUnitId": 102}	2025-10-15 12:44:25.681
315	101	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-15 12:44:45.928
316	101	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-15 12:44:45.93
317	101	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-15 12:44:45.932
318	101	SALE	Товар продан за 300 ₽	{"isCredit": false, "buyerName": "", "salePrice": 300, "buyerPhone": ""}	2025-10-15 12:45:09.424
321	104	SYSTEM	CLEAR unit создан как замена для кандидата #274300-20251015-135813836-692076	{"purpose": "replacement_for_candidate", "sourceUnitId": 81, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "274300-20251015-135813836-692076"}	2025-10-16 08:26:26.83
326	108	SYSTEM	CLEAR unit создан как замена для кандидата #563592-20251016-112217815-339462	{"purpose": "replacement_for_candidate", "sourceUnitId": 103, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "563592-20251016-112217815-339462"}	2025-10-16 08:28:16.498
341	114	SYSTEM	Unit автоматически создан из продукта Головка двенадцатигранная 19мм 1/2"	\N	2025-10-16 08:45:35.578
342	114	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-16 08:45:45.815
344	114	SPROUTED	Unit преобразован в SPROUTED для создания 6 дочерних заявок	{"pricePerUnit": 2.94, "childrenCount": 6}	2025-10-16 08:46:36.664
345	116	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 6, "sequence": 1, "parentUnitId": 114}	2025-10-16 08:46:36.667
346	117	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 6, "sequence": 2, "parentUnitId": 114}	2025-10-16 08:46:36.67
347	118	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 6, "sequence": 3, "parentUnitId": 114}	2025-10-16 08:46:36.674
348	119	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 6, "sequence": 4, "parentUnitId": 114}	2025-10-16 08:46:36.677
349	120	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 6, "sequence": 5, "parentUnitId": 114}	2025-10-16 08:46:36.68
350	121	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 6, "sequence": 6, "parentUnitId": 114}	2025-10-16 08:46:36.686
351	121	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-16 08:46:48.516
352	121	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-16 08:46:48.518
353	121	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-16 08:46:48.52
354	120	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-16 08:46:52.7
355	120	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-16 08:46:52.702
356	120	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-16 08:46:52.704
357	119	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-16 08:46:55.231
358	119	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-16 08:46:55.233
359	119	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-16 08:46:55.235
379	122	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-16 08:55:22.505
380	123	SYSTEM	CLEAR unit создан как замена для кандидата #RF-802222-20251016-115419551-260447	{"purpose": "replacement_for_candidate", "sourceUnitId": 122, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "RF-802222-20251016-115419551-260447"}	2025-10-16 08:55:32.5
381	122	SPROUTED	Unit преобразован в SPROUTED для создания 3 дочерних заявок	{"pricePerUnit": 9.72, "childrenCount": 3}	2025-10-16 08:55:32.518
382	124	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 1, "parentUnitId": 122}	2025-10-16 08:55:32.521
383	125	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 2, "parentUnitId": 122}	2025-10-16 08:55:32.525
384	126	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 3, "parentUnitId": 122}	2025-10-16 08:55:32.528
385	126	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-16 08:55:45.907
386	126	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-16 08:55:45.91
387	126	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-16 08:55:45.912
388	125	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-16 08:55:48.572
389	125	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-16 08:55:48.574
390	125	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-16 08:55:48.576
391	124	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-16 08:55:51.018
392	124	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-16 08:55:51.02
393	124	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-16 08:55:51.022
394	126	SALE	Товар продан за 12 ₽	{"isCredit": false, "buyerName": "", "salePrice": 12, "buyerPhone": ""}	2025-10-16 08:56:15.574
395	127	SYSTEM	Unit автоматически создан из продукта Набор инструментов 108пр.1/4''&1/2''(6гр.)(4-32мм)	\N	2025-10-16 09:04:21.492
396	127	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-16 09:04:38.118
397	128	SYSTEM	CLEAR unit создан как замена для кандидата #RF-41082-5L EURO-20251016-120421490-064344	{"purpose": "replacement_for_candidate", "sourceUnitId": 127, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "RF-41082-5L EURO-20251016-120421490-064344"}	2025-10-16 09:05:05.058
398	127	IN_REQUEST	Создана одиночная заявка, цена: 190	{"pricePerUnit": 190, "clearReplacementUnitId": 128}	2025-10-16 09:05:05.066
399	127	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-16 09:05:16.726
400	127	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-16 09:05:16.729
401	127	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-16 09:05:16.731
402	127	SALE	Товар продан за 260 ₽	{"isCredit": false, "buyerName": "", "salePrice": 260, "buyerPhone": ""}	2025-10-16 09:05:41.356
403	129	SYSTEM	Unit автоматически создан из продукта Головка 1/2" с насадкой HEX 17мм TOPTUL	\N	2025-10-16 09:11:40.084
404	129	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-16 09:12:16.803
405	130	SYSTEM	CLEAR unit создан как замена для кандидата #BCDA1617-20251016-121140082-248354	{"purpose": "replacement_for_candidate", "sourceUnitId": 129, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "BCDA1617-20251016-121140082-248354"}	2025-10-16 09:12:44.423
406	129	SPROUTED	Unit преобразован в SPROUTED для создания 4 дочерних заявок	{"pricePerUnit": 9.64, "childrenCount": 4}	2025-10-16 09:12:44.438
407	131	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 4, "sequence": 1, "parentUnitId": 129}	2025-10-16 09:12:44.442
408	132	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 4, "sequence": 2, "parentUnitId": 129}	2025-10-16 09:12:44.445
409	133	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 4, "sequence": 3, "parentUnitId": 129}	2025-10-16 09:12:44.449
410	134	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 4, "sequence": 4, "parentUnitId": 129}	2025-10-16 09:12:44.453
411	134	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-16 09:13:02.543
412	134	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-16 09:13:02.545
413	134	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-16 09:13:02.548
414	133	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-16 09:13:05.784
415	133	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-16 09:13:05.786
416	133	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-16 09:13:05.788
417	132	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-16 09:13:08.592
418	132	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-16 09:13:08.594
419	132	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-16 09:13:08.596
420	131	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-16 09:13:11.165
421	131	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-16 09:13:11.167
422	131	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-16 09:13:11.169
423	134	SALE	Товар продан за 20 ₽	{"isCredit": false, "buyerName": "", "salePrice": 20, "buyerPhone": ""}	2025-10-16 09:13:42.583
424	135	SYSTEM	Unit автоматически создан из продукта Бита SPLINE M12х75мм,10мм	\N	2025-10-16 09:20:20.782
425	135	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-16 09:22:52.692
426	136	SYSTEM	CLEAR unit создан как замена для кандидата #1787512-20251016-122020781-572711	{"purpose": "replacement_for_candidate", "sourceUnitId": 135, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "1787512-20251016-122020781-572711"}	2025-10-16 09:23:40.051
427	135	SPROUTED	Unit преобразован в SPROUTED для создания 6 дочерних заявок	{"pricePerUnit": 3.12, "childrenCount": 6}	2025-10-16 09:23:40.066
428	137	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 6, "sequence": 1, "parentUnitId": 135}	2025-10-16 09:23:40.069
429	138	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 6, "sequence": 2, "parentUnitId": 135}	2025-10-16 09:23:40.072
430	139	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 6, "sequence": 3, "parentUnitId": 135}	2025-10-16 09:23:40.075
431	140	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 6, "sequence": 4, "parentUnitId": 135}	2025-10-16 09:23:40.078
432	141	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 6, "sequence": 5, "parentUnitId": 135}	2025-10-16 09:23:40.081
433	142	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 6, "sequence": 6, "parentUnitId": 135}	2025-10-16 09:23:40.085
434	142	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-16 09:23:59.632
435	142	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-16 09:23:59.634
436	142	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-16 09:23:59.636
437	141	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-16 09:24:02.458
438	141	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-16 09:24:02.46
439	141	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-16 09:24:02.462
440	140	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-16 09:24:04.411
441	140	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-16 09:24:04.413
442	140	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-16 09:24:04.415
443	139	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-16 09:24:09.72
444	139	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-16 09:24:09.723
445	139	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-16 09:24:09.725
446	138	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-16 09:24:12.795
447	138	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-16 09:24:12.797
448	138	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-16 09:24:12.799
449	137	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-16 09:24:16.097
450	137	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-16 09:24:16.099
451	137	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-16 09:24:16.101
452	142	SALE	Товар продан за 6 ₽	{"isCredit": false, "buyerName": "", "salePrice": 6, "buyerPhone": ""}	2025-10-16 09:24:45.903
453	143	SYSTEM	Unit автоматически создан из продукта Набор щупов 32пр. (0.04-0.88мм), в чехле	\N	2025-10-16 09:30:49.02
454	143	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-16 09:30:58.292
455	144	SYSTEM	CLEAR unit создан как замена для кандидата #F-61804-20251016-123049019-873137	{"purpose": "replacement_for_candidate", "sourceUnitId": 143, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "F-61804-20251016-123049019-873137"}	2025-10-16 09:31:20.144
456	143	IN_REQUEST	Создана одиночная заявка, цена: 11.4	{"pricePerUnit": 11.4, "clearReplacementUnitId": 144}	2025-10-16 09:31:20.149
457	143	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-16 09:31:46.226
458	143	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-16 09:31:46.228
459	143	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-16 09:31:46.23
460	143	SALE	Товар продан за 17 ₽	{"isCredit": false, "buyerName": "", "salePrice": 17, "buyerPhone": ""}	2025-10-16 09:32:05.718
461	145	SYSTEM	Unit автоматически создан из продукта Головка шестигранная 8мм 3/8"	\N	2025-10-17 06:57:55.026
462	145	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-17 06:58:06.196
463	146	SYSTEM	CLEAR unit создан как замена для кандидата #610 008-20251017-095755024-242047	{"purpose": "replacement_for_candidate", "sourceUnitId": 145, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "610 008-20251017-095755024-242047"}	2025-10-17 06:58:55.064
464	145	SPROUTED	Unit преобразован в SPROUTED для создания 2 дочерних заявок	{"pricePerUnit": 1.68, "childrenCount": 2}	2025-10-17 06:58:55.072
465	147	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 1, "parentUnitId": 145}	2025-10-17 06:58:55.075
466	148	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 2, "parentUnitId": 145}	2025-10-17 06:58:55.079
467	147	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-17 06:59:09.223
468	147	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-17 06:59:09.226
469	147	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-17 06:59:09.228
470	147	SALE	Товар продан за 4 ₽	{"isCredit": false, "buyerName": "", "salePrice": 4, "buyerPhone": ""}	2025-10-17 06:59:33.801
471	149	SYSTEM	Unit автоматически создан из продукта Набор экстракторов 5шт TOPTUL	\N	2025-10-17 07:04:55.153
472	149	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-17 07:05:28.583
473	150	SYSTEM	CLEAR unit создан как замена для кандидата #JGAW0501-20251017-100455151-327662	{"purpose": "replacement_for_candidate", "sourceUnitId": 149, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "JGAW0501-20251017-100455151-327662"}	2025-10-17 07:05:53.71
474	149	IN_REQUEST	Создана одиночная заявка, цена: 15.61	{"pricePerUnit": 15.61, "clearReplacementUnitId": 150}	2025-10-17 07:05:53.722
475	149	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-17 07:06:12.06
476	149	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-17 07:06:12.062
477	149	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-17 07:06:12.064
478	149	SALE	Товар продан за 22 ₽	{"isCredit": false, "buyerName": "", "salePrice": 22, "buyerPhone": ""}	2025-10-17 07:06:45.922
479	151	SYSTEM	Unit автоматически создан из продукта Щётка-мини, нейлоновая щетина	\N	2025-10-17 07:16:01.527
480	151	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-17 07:16:16.508
481	152	SYSTEM	CLEAR unit создан как замена для кандидата #270038-20251017-101601525-264985	{"purpose": "replacement_for_candidate", "sourceUnitId": 151, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "270038-20251017-101601525-264985"}	2025-10-17 07:17:24.761
482	151	SPROUTED	Unit преобразован в SPROUTED для создания 4 дочерних заявок	{"pricePerUnit": 1.32, "childrenCount": 4}	2025-10-17 07:17:24.767
483	153	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 4, "sequence": 1, "parentUnitId": 151}	2025-10-17 07:17:24.77
484	154	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 4, "sequence": 2, "parentUnitId": 151}	2025-10-17 07:17:24.774
485	155	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 4, "sequence": 3, "parentUnitId": 151}	2025-10-17 07:17:24.777
486	156	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 4, "sequence": 4, "parentUnitId": 151}	2025-10-17 07:17:24.78
487	156	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-17 07:17:36.047
488	156	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-17 07:17:36.05
489	156	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-17 07:17:36.052
490	155	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-17 07:17:38.804
491	155	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-17 07:17:38.806
492	155	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-17 07:17:38.808
493	154	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-17 07:17:41.113
494	154	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-17 07:17:41.115
495	154	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-17 07:17:41.117
496	153	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-17 07:17:45.43
497	153	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-17 07:17:45.432
498	153	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-17 07:17:45.434
499	157	SYSTEM	Unit автоматически создан из продукта Метчик M10x1,25 (3шт)	\N	2025-10-17 08:22:01.242
500	157	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-17 08:22:11.495
501	158	SYSTEM	CLEAR unit создан как замена для кандидата #Sch-TAP10x1,25-20251017-112201241-398772	{"purpose": "replacement_for_candidate", "sourceUnitId": 157, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "Sch-TAP10x1,25-20251017-112201241-398772"}	2025-10-17 08:24:31.422
502	157	IN_REQUEST	Создана одиночная заявка, цена: 5.6	{"pricePerUnit": 5.6, "clearReplacementUnitId": 158}	2025-10-17 08:24:31.426
503	157	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-17 08:24:55.315
504	157	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-17 08:24:55.317
505	157	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-17 08:24:55.319
506	157	SALE	Товар продан за 10 ₽	{"isCredit": false, "buyerName": "", "salePrice": 10, "buyerPhone": ""}	2025-10-17 08:33:21.909
507	159	SYSTEM	Unit автоматически создан из продукта Съемник внутрених стопорных колец изогнутый 90грд. (глубина-56мм, для суппортов), в блистере	\N	2025-10-17 09:41:05.056
508	159	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-17 09:41:15.239
509	160	SYSTEM	CLEAR unit создан как замена для кандидата #F-9U0102-20251017-124105055-430025	{"purpose": "replacement_for_candidate", "sourceUnitId": 159, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "F-9U0102-20251017-124105055-430025"}	2025-10-17 09:41:58.778
510	159	IN_REQUEST	Создана одиночная заявка, цена: 19.41	{"pricePerUnit": 19.41, "clearReplacementUnitId": 160}	2025-10-17 09:41:58.792
511	23	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-17 09:42:08.605
512	23	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-17 09:42:08.608
513	23	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-17 09:42:08.61
514	159	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-17 09:42:48.215
515	159	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-17 09:42:48.217
516	159	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-17 09:42:48.22
517	159	SALE	Товар продан за 30 ₽	{"isCredit": false, "buyerName": "", "salePrice": 30, "buyerPhone": ""}	2025-10-17 09:43:19.397
518	161	SYSTEM	Unit автоматически создан из продукта Клещи для хомутов ШРУСа	\N	2025-10-17 09:49:50.315
519	161	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-17 09:50:15.313
520	162	SYSTEM	CLEAR unit создан как замена для кандидата #816105-20251017-124950313-131002	{"purpose": "replacement_for_candidate", "sourceUnitId": 161, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "816105-20251017-124950313-131002"}	2025-10-17 09:57:00.159
521	161	IN_REQUEST	Создана одиночная заявка, цена: 24.48	{"pricePerUnit": 24.48, "clearReplacementUnitId": 162}	2025-10-17 09:57:00.164
522	161	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-17 09:57:18.131
523	161	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-17 09:57:18.133
524	161	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-17 09:57:18.135
525	161	SALE	Товар продан за 30 ₽	{"isCredit": false, "buyerName": "", "salePrice": 30, "buyerPhone": ""}	2025-10-17 09:57:38.739
526	113	SALE	Товар продан за 22 ₽	{"isCredit": false, "buyerName": "", "salePrice": 22, "buyerPhone": ""}	2025-10-17 09:59:16.525
527	112	STATUS_CHANGE	Откат статуса: IN_STORE → IN_REQUEST (возврат в запрос)	{"timestamp": "2025-10-17T09:59:40.380Z", "newCardStatus": "IN_REQUEST", "newProductStatus": null, "previousCardStatus": "ARRIVED", "previousProductStatus": "IN_STORE"}	2025-10-17 09:59:40.381
528	111	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-17 09:59:52.486
529	163	SYSTEM	CLEAR unit создан как замена для кандидата #563592-20251016-112946671-037269	{"purpose": "replacement_for_candidate", "sourceUnitId": 111, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "563592-20251016-112946671-037269"}	2025-10-17 10:00:27.238
530	111	IN_REQUEST	Создана одиночная заявка, цена: 15.84	{"pricePerUnit": 15.84, "clearReplacementUnitId": 163}	2025-10-17 10:00:27.25
531	164	SYSTEM	Unit автоматически создан из продукта Вставка для разборки стойки амортизатора (Nissan) 4мм Rock FORCE RF-1022-34	\N	2025-10-17 10:09:11.44
532	164	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-17 10:09:19.533
533	165	SYSTEM	CLEAR unit создан как замена для кандидата #RF-1022-34-20251017-130911439-664989	{"purpose": "replacement_for_candidate", "sourceUnitId": 164, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "RF-1022-34-20251017-130911439-664989"}	2025-10-17 10:09:37.583
534	164	IN_REQUEST	Создана одиночная заявка, цена: 9.15	{"pricePerUnit": 9.15, "clearReplacementUnitId": 165}	2025-10-17 10:09:37.596
535	164	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-17 10:09:48.605
536	164	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-17 10:09:48.607
537	164	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-17 10:09:48.61
538	164	SALE	Товар продан за 15 ₽	{"isCredit": false, "buyerName": "", "salePrice": 15, "buyerPhone": ""}	2025-10-17 10:10:09.781
539	166	SYSTEM	Unit автоматически создан из продукта Набор ключей накидн. 6-22мм 8шт PRO STARTUL GT (PRO-83008) (пласт. подвес)	\N	2025-10-17 10:14:16.319
540	166	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-17 10:14:26.156
541	167	SYSTEM	CLEAR unit создан как замена для кандидата #PRO-83008-20251017-131416317-135234	{"purpose": "replacement_for_candidate", "sourceUnitId": 166, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "PRO-83008-20251017-131416317-135234"}	2025-10-17 10:14:49.794
542	166	IN_REQUEST	Создана одиночная заявка, цена: 40.57	{"pricePerUnit": 40.57, "clearReplacementUnitId": 167}	2025-10-17 10:14:49.829
543	166	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-17 10:15:26.308
544	166	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-17 10:15:26.311
545	166	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-17 10:15:26.314
546	166	SALE	Товар продан за 52 ₽	{"isCredit": false, "buyerName": "", "salePrice": 52, "buyerPhone": ""}	2025-10-17 10:16:22.371
547	156	SALE	Товар продан за 3 ₽	{"isCredit": false, "buyerName": "", "salePrice": 3, "buyerPhone": ""}	2025-10-18 06:12:17.717
548	168	SYSTEM	Unit автоматически создан из продукта Щетка-мини по металлу ручная в пластиковом корпусе с прорезиненной рукояткой (проволока из нержавеющей стали, 3x10рядов)	\N	2025-10-18 06:18:21.305
549	168	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-18 06:18:29.868
551	168	IN_REQUEST	Создана одиночная заявка, цена: 4.5	{"pricePerUnit": 4.5, "clearReplacementUnitId": 169}	2025-10-18 06:18:51.703
550	169	SYSTEM	CLEAR unit создан как замена для кандидата #F-34012829-20251018-091821303-202827	{"purpose": "replacement_for_candidate", "sourceUnitId": 168, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "F-34012829-20251018-091821303-202827"}	2025-10-18 06:18:51.688
552	168	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-18 06:19:02.593
553	168	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-18 06:19:02.595
554	168	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-18 06:19:02.598
555	168	SALE	Товар продан за 6 ₽	{"isCredit": false, "buyerName": "", "salePrice": 6, "buyerPhone": ""}	2025-10-18 06:19:33.573
556	170	SYSTEM	Unit автоматически создан из продукта Метчик M8x1,25 (3шт)	\N	2025-10-18 06:30:03.039
557	170	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-18 06:39:17.717
558	171	SYSTEM	Unit автоматически создан из продукта Метчик M9x1 (3шт)	\N	2025-10-18 06:42:21.62
559	171	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-18 06:42:32.991
560	172	SYSTEM	CLEAR unit создан как замена для кандидата #Метчик M9x1 (3шт)-20251018-094221619-081665	{"purpose": "replacement_for_candidate", "sourceUnitId": 171, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "Метчик M9x1 (3шт)-20251018-094221619-081665"}	2025-10-18 06:43:02.623
561	171	IN_REQUEST	Создана одиночная заявка, цена: 5.25	{"pricePerUnit": 5.25, "clearReplacementUnitId": 172}	2025-10-18 06:43:02.635
562	171	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-18 06:43:17.833
563	171	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-18 06:43:17.835
564	171	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-18 06:43:17.837
565	173	SYSTEM	Unit автоматически создан из продукта Метчик ручной М6 х 1,0 мм. комплект из 2 шт. Сибртех 76617	\N	2025-10-18 06:46:00.394
566	173	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-18 06:46:14.982
567	174	SYSTEM	CLEAR unit создан как замена для кандидата #76617-20251018-094600393-586489	{"purpose": "replacement_for_candidate", "sourceUnitId": 173, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "76617-20251018-094600393-586489"}	2025-10-18 06:47:11.977
568	173	SPROUTED	Unit преобразован в SPROUTED для создания 2 дочерних заявок	{"pricePerUnit": 5.7, "childrenCount": 2}	2025-10-18 06:47:11.991
569	175	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 1, "parentUnitId": 173}	2025-10-18 06:47:11.994
570	176	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 2, "parentUnitId": 173}	2025-10-18 06:47:11.997
571	175	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-18 06:47:22.249
572	175	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-18 06:47:22.251
573	175	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-18 06:47:22.253
574	176	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-18 06:47:25
575	176	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-18 06:47:25.003
576	176	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-18 06:47:25.005
577	177	SYSTEM	Unit автоматически создан из продукта Метчик M10x1,5 (3шт)	\N	2025-10-18 06:54:23.834
578	177	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-18 06:54:32.747
579	178	SYSTEM	CLEAR unit создан как замена для кандидата #Sch-TAP10x1,5-20251018-095423832-258317	{"purpose": "replacement_for_candidate", "sourceUnitId": 177, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "Sch-TAP10x1,5-20251018-095423832-258317"}	2025-10-18 06:54:59.529
580	177	IN_REQUEST	Создана одиночная заявка, цена: 5.16	{"pricePerUnit": 5.16, "clearReplacementUnitId": 178}	2025-10-18 06:54:59.542
581	177	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-18 06:55:16.989
582	177	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-18 06:55:16.992
583	177	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-18 06:55:16.995
584	179	SYSTEM	Unit автоматически создан из продукта МЕТЧИК ER-00710M M07X1 (2ШТ),В ПЛАСТИКОВОМ ФУТЛЯРЕ ЭВРИКА /1 NEW	\N	2025-10-18 06:56:34.163
585	179	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-18 06:56:41.26
586	180	SYSTEM	Unit автоматически создан из продукта Круг лепестковый 125х22мм P80 плоск. GEPARD (GP5016-80) (плоский КЛТ-1)	\N	2025-10-18 07:26:00.134
587	180	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-18 07:26:09.197
588	181	SYSTEM	CLEAR unit создан как замена для кандидата #GP5016-80-20251018-102600132-169626	{"purpose": "replacement_for_candidate", "sourceUnitId": 180, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "GP5016-80-20251018-102600132-169626"}	2025-10-18 07:27:00.619
589	180	SPROUTED	Unit преобразован в SPROUTED для создания 15 дочерних заявок	{"pricePerUnit": 2.05, "childrenCount": 15}	2025-10-18 07:27:00.635
590	182	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 15, "sequence": 1, "parentUnitId": 180}	2025-10-18 07:27:00.638
591	183	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 15, "sequence": 2, "parentUnitId": 180}	2025-10-18 07:27:00.641
592	184	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 15, "sequence": 3, "parentUnitId": 180}	2025-10-18 07:27:00.644
593	185	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 15, "sequence": 4, "parentUnitId": 180}	2025-10-18 07:27:00.647
594	186	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 15, "sequence": 5, "parentUnitId": 180}	2025-10-18 07:27:00.651
595	187	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 15, "sequence": 6, "parentUnitId": 180}	2025-10-18 07:27:00.654
596	188	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 15, "sequence": 7, "parentUnitId": 180}	2025-10-18 07:27:00.656
597	189	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 15, "sequence": 8, "parentUnitId": 180}	2025-10-18 07:27:00.659
598	190	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 15, "sequence": 9, "parentUnitId": 180}	2025-10-18 07:27:00.662
599	191	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 15, "sequence": 10, "parentUnitId": 180}	2025-10-18 07:27:00.665
600	192	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 15, "sequence": 11, "parentUnitId": 180}	2025-10-18 07:27:00.668
601	193	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 15, "sequence": 12, "parentUnitId": 180}	2025-10-18 07:27:00.671
602	194	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 15, "sequence": 13, "parentUnitId": 180}	2025-10-18 07:27:00.673
603	195	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 15, "sequence": 14, "parentUnitId": 180}	2025-10-18 07:27:00.676
604	196	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 15, "sequence": 15, "parentUnitId": 180}	2025-10-18 07:27:00.679
605	196	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-18 07:27:11.594
606	196	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-18 07:27:11.597
607	196	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-18 07:27:11.599
608	195	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-18 07:27:14.27
609	195	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-18 07:27:14.272
610	195	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-18 07:27:14.274
611	194	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-18 07:27:17.45
612	194	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-18 07:27:17.452
613	194	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-18 07:27:17.454
614	193	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-18 07:27:20.692
615	193	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-18 07:27:20.694
616	193	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-18 07:27:20.696
617	192	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-18 07:27:23.889
618	192	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-18 07:27:23.891
619	192	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-18 07:27:23.893
620	191	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-18 07:27:26.644
621	191	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-18 07:27:26.646
622	191	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-18 07:27:26.648
623	196	SALE	Товар продан за 3.5 ₽	{"isCredit": false, "buyerName": "", "salePrice": 3.5, "buyerPhone": ""}	2025-10-18 07:27:45.569
\.


--
-- Data for Name: product_units; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_units (id, serial_number, "productId", sale_price, sold_at, created_at, updated_at, credit_paid_at, "isReturned", is_credit, "parentProductUnitId", product_category_id, product_category_name, product_code, product_description, product_name, product_tags, request_price_per_unit, returned_at, "statusCard", "statusProduct", created_at_candidate, created_at_request, "customerId", quantity_in_candidate, quantity_in_request, "supplierId", "spineId", "disassembledParentId", "disassemblyStatus", "isParsingAlgorithm", "disassemblyScenarioId") FROM stdin;
2	RF-44836-20251014-122748341-419995	1	\N	\N	2025-10-14 09:27:48.343	2025-10-14 09:27:48.343	\N	f	f	\N	3	1/2" ударные короткие	RF-44836		Головка ударная 36мм (12гр.), 1/2''	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	1	\N	MONOLITH	f	\N
10	603010-20251014-141545642-385683/child-6-1760440651760-dvd0e6yy6	2	\N	\N	2025-10-14 11:17:31.761	2025-10-14 11:19:34.079	\N	f	f	3	5	E-Инструмент 1/4"	603010		Головка TORX E10 1/4"	null	1.38	\N	ARRIVED	IN_STORE	\N	2025-10-14 11:17:31.76	\N	0	0	\N	2	\N	MONOLITH	f	\N
7	603010-20251014-141545642-385683/child-3-1760440651751-7dg75j281	2	\N	\N	2025-10-14 11:17:31.752	2025-10-14 11:19:29.525	\N	f	f	3	5	E-Инструмент 1/4"	603010		Головка TORX E10 1/4"	null	1.38	\N	ARRIVED	IN_STORE	\N	2025-10-14 11:17:31.751	\N	0	0	\N	2	\N	MONOLITH	f	\N
14	603010-20251014-141545642-385683/child-10-1760440651772-68inq94l4	2	\N	\N	2025-10-14 11:17:31.773	2025-10-14 11:19:42.201	\N	f	f	3	5	E-Инструмент 1/4"	603010		Головка TORX E10 1/4"	null	1.38	\N	ARRIVED	IN_STORE	\N	2025-10-14 11:17:31.772	\N	0	0	\N	2	\N	MONOLITH	f	\N
1	RF-44836-20251014-122443231-921881	1	12	2025-10-14 09:30:56.711	2025-10-14 09:24:43.233	2025-10-14 09:30:56.712	\N	f	f	\N	3	1/2" ударные короткие	RF-44836		Головка ударная 36мм (12гр.), 1/2''	null	5.64	\N	ARRIVED	SOLD	2025-10-14 09:24:59.571	2025-10-14 09:27:48.348	\N	1	0	\N	1	\N	MONOLITH	f	\N
8	603010-20251014-141545642-385683/child-4-1760440651754-k64jbb3u9	2	\N	\N	2025-10-14 11:17:31.755	2025-10-14 11:19:31.301	\N	f	f	3	5	E-Инструмент 1/4"	603010		Головка TORX E10 1/4"	null	1.38	\N	ARRIVED	IN_STORE	\N	2025-10-14 11:17:31.754	\N	0	0	\N	2	\N	MONOLITH	f	\N
4	603010-20251014-141731734-349576	2	\N	\N	2025-10-14 11:17:31.736	2025-10-14 11:17:31.736	\N	f	f	\N	5	E-Инструмент 1/4"	603010		Головка TORX E10 1/4"	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	2	\N	MONOLITH	f	\N
3	603010-20251014-141545642-385683	2	\N	\N	2025-10-14 11:15:45.644	2025-10-14 11:17:31.741	\N	f	f	\N	5	E-Инструмент 1/4"	603010		Головка TORX E10 1/4"	null	\N	\N	SPROUTED	\N	2025-10-14 11:17:12.436	\N	\N	1	0	\N	2	\N	MONOLITH	f	\N
11	603010-20251014-141545642-385683/child-7-1760440651763-ov3l2ul2k	2	\N	\N	2025-10-14 11:17:31.764	2025-10-14 11:19:35.264	\N	f	f	3	5	E-Инструмент 1/4"	603010		Головка TORX E10 1/4"	null	1.38	\N	ARRIVED	IN_STORE	\N	2025-10-14 11:17:31.763	\N	0	0	\N	2	\N	MONOLITH	f	\N
5	603010-20251014-141545642-385683/child-1-1760440651744-o85qjpreb	2	\N	\N	2025-10-14 11:17:31.745	2025-10-14 11:19:25.504	\N	f	f	3	5	E-Инструмент 1/4"	603010		Головка TORX E10 1/4"	null	1.38	\N	ARRIVED	IN_STORE	\N	2025-10-14 11:17:31.744	\N	0	0	\N	2	\N	MONOLITH	f	\N
27	JCB-TH52002C-20251014-144559634-461770_PART_1760442570889_7	7	40	2025-10-14 11:49:57.088	2025-10-14 11:49:30.89	2025-10-14 11:49:57.089	\N	f	f	\N	11	\N	JCB-TH52002C-Part2		Подставка ремонтная 2т (h min 278mm, h max 425mm)	\N	\N	\N	ARRIVED	SOLD	\N	\N	\N	0	0	\N	5	24	PARTIAL	f	\N
12	603010-20251014-141545642-385683/child-8-1760440651766-quhbm8msw	2	\N	\N	2025-10-14 11:17:31.767	2025-10-14 11:19:38.007	\N	f	f	3	5	E-Инструмент 1/4"	603010		Головка TORX E10 1/4"	null	1.38	\N	ARRIVED	IN_STORE	\N	2025-10-14 11:17:31.766	\N	0	0	\N	2	\N	MONOLITH	f	\N
6	603010-20251014-141545642-385683/child-2-1760440651748-5o9rynfgn	2	\N	\N	2025-10-14 11:17:31.749	2025-10-14 11:19:27.823	\N	f	f	3	5	E-Инструмент 1/4"	603010		Головка TORX E10 1/4"	null	1.38	\N	ARRIVED	IN_STORE	\N	2025-10-14 11:17:31.748	\N	0	0	\N	2	\N	MONOLITH	f	\N
9	603010-20251014-141545642-385683/child-5-1760440651757-qif4ibjm3	2	\N	\N	2025-10-14 11:17:31.758	2025-10-14 11:19:32.748	\N	f	f	3	5	E-Инструмент 1/4"	603010		Головка TORX E10 1/4"	null	1.38	\N	ARRIVED	IN_STORE	\N	2025-10-14 11:17:31.757	\N	0	0	\N	2	\N	MONOLITH	f	\N
15	603010-20251014-141545642-385683/child-11-1760440651775-w9sxthzcv	2	5	2025-10-14 11:20:13.099	2025-10-14 11:17:31.776	2025-10-14 11:20:13.1	\N	f	f	3	5	E-Инструмент 1/4"	603010		Головка TORX E10 1/4"	null	1.38	\N	ARRIVED	SOLD	\N	2025-10-14 11:17:31.775	\N	0	0	\N	2	\N	MONOLITH	f	\N
18	514412-20251014-143200930-317103/child-1-1760441568077-vh9jmteff	3	12	2025-10-14 11:34:34.172	2025-10-14 11:32:48.078	2025-10-14 11:34:34.173	\N	f	f	16	7	E-типа	514412		Ключ накидной TORX Е10×Е12	null	8.22	\N	ARRIVED	SOLD	\N	2025-10-14 11:32:48.077	\N	0	0	\N	3	\N	MONOLITH	f	\N
13	603010-20251014-141545642-385683/child-9-1760440651769-5yiqlklv8	2	\N	\N	2025-10-14 11:17:31.77	2025-10-14 11:19:39.97	\N	f	f	3	5	E-Инструмент 1/4"	603010		Головка TORX E10 1/4"	null	1.38	\N	ARRIVED	IN_STORE	\N	2025-10-14 11:17:31.769	\N	0	0	\N	2	\N	MONOLITH	f	\N
17	514412-20251014-143248068-403129	3	\N	\N	2025-10-14 11:32:48.069	2025-10-14 11:32:48.069	\N	f	f	\N	7	E-типа	514412		Ключ накидной TORX Е10×Е12	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	3	\N	MONOLITH	f	\N
16	514412-20251014-143200930-317103	3	\N	\N	2025-10-14 11:32:00.931	2025-10-14 11:32:48.075	\N	f	f	\N	7	E-типа	514412		Ключ накидной TORX Е10×Е12	null	\N	\N	SPROUTED	\N	2025-10-14 11:32:12.081	\N	\N	1	0	\N	3	\N	MONOLITH	f	\N
26	JCB-TH52002C-20251014-144559634-461770_PART_1760442570885_6	6	\N	\N	2025-10-14 11:49:30.887	2025-10-14 11:49:30.887	\N	f	f	\N	11	\N	JCB-TH52002C-Part	ОДНА ПОДСТАВКА	Подставка ремонтная 2т (h min 278mm, h max 425mm)	\N	\N	\N	ARRIVED	IN_STORE	\N	\N	\N	0	0	\N	5	24	PARTIAL	f	\N
25	JCB-TH52002C-20251014-144625405-894424	5	\N	\N	2025-10-14 11:46:25.408	2025-10-14 11:46:25.408	\N	f	f	\N	11	Подставки	JCB-TH52002C		Подставка ремонтная 2т (h min 278mm, h max 425mm), к-т 2шт	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	5	\N	MONOLITH	f	\N
21	622030-20251014-143918582-810915	4	\N	\N	2025-10-14 11:39:18.584	2025-10-14 11:39:18.584	\N	f	f	\N	8	1/2" короткие	622030		Головка двенадцатигранная 30мм 1/2"	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	4	\N	MONOLITH	f	\N
20	622030-20251014-143845118-408920	4	\N	\N	2025-10-14 11:38:45.12	2025-10-14 11:39:18.599	\N	f	f	\N	8	1/2" короткие	622030		Головка двенадцатигранная 30мм 1/2"	null	\N	\N	SPROUTED	\N	2025-10-14 11:38:53.845	\N	\N	1	0	\N	4	\N	MONOLITH	f	\N
22	622030-20251014-143845118-408920/child-1-1760441958602-i9f8qnamq	4	10	2025-10-14 11:39:54.976	2025-10-14 11:39:18.603	2025-10-14 11:39:54.977	\N	f	f	20	8	1/2" короткие	622030		Головка двенадцатигранная 30мм 1/2"	null	7.26	\N	ARRIVED	SOLD	\N	2025-10-14 11:39:18.602	\N	0	0	\N	4	\N	MONOLITH	f	\N
24	JCB-TH52002C-20251014-144559634-461770	5	\N	\N	2025-10-14 11:45:59.636	2025-10-14 11:49:30.893	\N	f	f	\N	11	Подставки	JCB-TH52002C		Подставка ремонтная 2т (h min 278mm, h max 425mm), к-т 2шт	null	59.97	\N	ARRIVED	IN_DISASSEMBLED	2025-10-14 11:46:09.348	2025-10-14 11:46:25.412	\N	1	0	\N	5	\N	DISASSEMBLED	f	1
115	622019-20251016-114636649-953368	26	\N	\N	2025-10-16 08:46:36.65	2025-10-16 08:46:36.65	\N	f	f	\N	8	1/2" короткие	622019		Головка двенадцатигранная 19мм 1/2"	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	23	\N	MONOLITH	f	\N
29	RF-9T0801-20251014-150250741-831507	8	\N	\N	2025-10-14 12:02:50.742	2025-10-14 12:02:50.742	\N	f	f	\N	15	Съемник рулевых тяг	RF-9T0801		Съемник рулевых тяг универсальный 27-42мм, 1/2''	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	6	\N	MONOLITH	f	\N
103	563592-20251016-112217815-339462	25	\N	\N	2025-10-16 08:22:17.817	2025-10-16 08:28:16.504	\N	f	f	\N	43	Г-образные Torx наборы	563592		Набор ключей TORX с отверстием удлинённых 9шт.	null	\N	\N	SPROUTED	\N	2025-10-16 08:22:33.893	\N	\N	1	0	\N	22	\N	MONOLITH	f	\N
28	RF-9T0801-20251014-150113724-816881	8	\N	\N	2025-10-14 12:01:13.726	2025-10-14 12:04:07.787	\N	f	f	\N	15	Съемник рулевых тяг	RF-9T0801		Съемник рулевых тяг универсальный 27-42мм, 1/2''	null	10.92	\N	ARRIVED	IN_STORE	2025-10-14 12:01:22.643	2025-10-14 12:02:50.754	\N	1	0	\N	6	\N	MONOLITH	f	\N
30	PA-44740-20251014-150753496-311876	9	25	2025-10-14 12:08:58.919	2025-10-14 12:07:53.497	2025-10-14 12:08:58.92	\N	f	f	\N	18	Сверло ступенчатое	PA-44740		Сверло ступенчатое HSS 4241(4-32мм), в блистере	null	20.4	\N	ARRIVED	SOLD	2025-10-14 12:08:02.607	2025-10-14 12:08:16.336	\N	1	0	\N	7	\N	MONOLITH	f	\N
31	PA-44740-20251014-150816322-247159	9	\N	\N	2025-10-14 12:08:16.324	2025-10-14 12:09:33.467	\N	f	f	\N	18	Сверло ступенчатое	PA-44740		Сверло ступенчатое HSS 4241(4-32мм), в блистере	null	\N	\N	CANDIDATE	\N	2025-10-14 12:09:33.466	\N	\N	1	0	\N	7	\N	MONOLITH	f	\N
33	RF-75713-20251014-151325223-710237	10	\N	\N	2025-10-14 12:13:25.225	2025-10-14 12:13:25.225	\N	f	f	\N	20	Ключ комбинированный трещоточный	RF-75713		Ключ комбинированный трещоточный 13мм	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	8	\N	MONOLITH	f	\N
19	514412-20251014-143200930-317103/child-2-1760441568081-4eybvlrgs	3	\N	\N	2025-10-14 11:32:48.082	2025-10-14 12:25:31.643	\N	f	f	16	7	E-типа	514412		Ключ накидной TORX Е10×Е12	null	8.22	\N	ARRIVED	IN_STORE	\N	2025-10-14 11:32:48.081	\N	0	0	\N	3	\N	MONOLITH	f	\N
104	274300-20251016-112626829-647176	19	\N	\N	2025-10-16 08:26:26.83	2025-10-16 08:26:26.83	\N	f	f	\N	35	Щётки для УШМ	274300		Щётка для УШМ проволочная конусная 100мм	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	17	\N	MONOLITH	f	\N
32	RF-75713-20251014-151241236-575125	10	14	2025-10-14 12:14:02.318	2025-10-14 12:12:41.238	2025-10-14 12:14:02.319	\N	f	f	\N	20	Ключ комбинированный трещоточный	RF-75713		Ключ комбинированный трещоточный 13мм	null	9.69	\N	ARRIVED	SOLD	2025-10-14 12:12:52.851	2025-10-14 12:13:25.236	\N	1	0	\N	8	\N	MONOLITH	f	\N
35	RF-1747505 Premium-20251014-152521335-592523	11	\N	\N	2025-10-14 12:25:21.337	2025-10-14 12:25:21.337	\N	f	f	\N	22	10мм длинные	RF-1747505 Premium		Бита 6-гранная H5х75ммL,10мм	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	9	\N	MONOLITH	f	\N
34	RF-1747505 Premium-20251014-151713406-466685	11	\N	\N	2025-10-14 12:17:13.407	2025-10-14 12:25:21.342	\N	f	f	\N	22	10мм длинные	RF-1747505 Premium		Бита 6-гранная H5х75ммL,10мм	null	\N	\N	SPROUTED	\N	2025-10-14 12:17:30.543	\N	\N	1	0	\N	9	\N	MONOLITH	f	\N
38	RF-1747505 Premium-20251014-151713406-466685/child-3-1760444721351-m6lans1uc	11	\N	\N	2025-10-14 12:25:21.352	2025-10-14 12:26:06.915	\N	f	f	34	22	10мм длинные	RF-1747505 Premium		Бита 6-гранная H5х75ммL,10мм	null	2.34	\N	ARRIVED	IN_STORE	\N	2025-10-14 12:25:21.351	\N	0	0	\N	9	\N	MONOLITH	f	\N
36	RF-1747505 Premium-20251014-151713406-466685/child-1-1760444721344-hvlpnn2m9	11	\N	\N	2025-10-14 12:25:21.345	2025-10-14 12:26:00.062	\N	f	f	34	22	10мм длинные	RF-1747505 Premium		Бита 6-гранная H5х75ммL,10мм	null	2.34	\N	ARRIVED	IN_STORE	\N	2025-10-14 12:25:21.344	\N	0	0	\N	9	\N	MONOLITH	f	\N
122	RF-802222-20251016-115419551-260447	27	\N	\N	2025-10-16 08:54:19.555	2025-10-16 08:55:32.518	\N	f	f	\N	44	1/4" Трещотки	RF-802222		Трещотка реверсивная усиленная изогнутая с резиновой ручкой 1/4''(72зуб.)	null	\N	\N	SPROUTED	\N	2025-10-16 08:55:22.504	\N	\N	1	0	\N	24	\N	MONOLITH	f	\N
37	RF-1747505 Premium-20251014-151713406-466685/child-2-1760444721348-aqbq8ct01	11	\N	\N	2025-10-14 12:25:21.349	2025-10-14 12:26:04.115	\N	f	f	34	22	10мм длинные	RF-1747505 Premium		Бита 6-гранная H5х75ммL,10мм	null	2.34	\N	ARRIVED	IN_STORE	\N	2025-10-14 12:25:21.348	\N	0	0	\N	9	\N	MONOLITH	f	\N
39	RF-1747505 Premium-20251014-151713406-466685/child-4-1760444721354-o5qs83lse	11	\N	\N	2025-10-14 12:25:21.355	2025-10-14 12:26:08.882	\N	f	f	34	22	10мм длинные	RF-1747505 Premium		Бита 6-гранная H5х75ммL,10мм	null	2.34	\N	ARRIVED	IN_STORE	\N	2025-10-14 12:25:21.354	\N	0	0	\N	9	\N	MONOLITH	f	\N
40	RF-1747505 Premium-20251014-151713406-466685/child-5-1760444721357-k80t46ma0	11	\N	\N	2025-10-14 12:25:21.358	2025-10-14 12:26:10.546	\N	f	f	34	22	10мм длинные	RF-1747505 Premium		Бита 6-гранная H5х75ммL,10мм	null	2.34	\N	ARRIVED	IN_STORE	\N	2025-10-14 12:25:21.357	\N	0	0	\N	9	\N	MONOLITH	f	\N
41	RF-1747505 Premium-20251014-151713406-466685/child-6-1760444721360-qtgy6dcy4	11	\N	\N	2025-10-14 12:25:21.361	2025-10-14 12:26:12.414	\N	f	f	34	22	10мм длинные	RF-1747505 Premium		Бита 6-гранная H5х75ммL,10мм	null	2.34	\N	ARRIVED	IN_STORE	\N	2025-10-14 12:25:21.361	\N	0	0	\N	9	\N	MONOLITH	f	\N
42	RF-1747505 Premium-20251014-151713406-466685/child-7-1760444721363-5enfjlybt	11	\N	\N	2025-10-14 12:25:21.364	2025-10-14 12:26:14.146	\N	f	f	34	22	10мм длинные	RF-1747505 Premium		Бита 6-гранная H5х75ммL,10мм	null	2.34	\N	ARRIVED	IN_STORE	\N	2025-10-14 12:25:21.363	\N	0	0	\N	9	\N	MONOLITH	f	\N
43	RF-1747505 Premium-20251014-151713406-466685/child-8-1760444721366-kynsaor86	11	\N	\N	2025-10-14 12:25:21.367	2025-10-14 12:26:16.613	\N	f	f	34	22	10мм длинные	RF-1747505 Premium		Бита 6-гранная H5х75ммL,10мм	null	2.34	\N	ARRIVED	IN_STORE	\N	2025-10-14 12:25:21.366	\N	0	0	\N	9	\N	MONOLITH	f	\N
44	RF-1747505 Premium-20251014-151713406-466685/child-9-1760444721369-7x7gmbvg5	11	\N	\N	2025-10-14 12:25:21.37	2025-10-14 12:26:18.492	\N	f	f	34	22	10мм длинные	RF-1747505 Premium		Бита 6-гранная H5х75ммL,10мм	null	2.34	\N	ARRIVED	IN_STORE	\N	2025-10-14 12:25:21.369	\N	0	0	\N	9	\N	MONOLITH	f	\N
45	RF-1747505 Premium-20251014-151713406-466685/child-10-1760444721372-997efveom	11	\N	\N	2025-10-14 12:25:21.373	2025-10-14 12:26:20.214	\N	f	f	34	22	10мм длинные	RF-1747505 Premium		Бита 6-гранная H5х75ммL,10мм	null	2.34	\N	ARRIVED	IN_STORE	\N	2025-10-14 12:25:21.372	\N	0	0	\N	9	\N	MONOLITH	f	\N
46	RF-1747505 Premium-20251014-151713406-466685/child-11-1760444721374-glunb3r9t	11	\N	\N	2025-10-14 12:25:21.375	2025-10-14 12:26:23.244	\N	f	f	34	22	10мм длинные	RF-1747505 Premium		Бита 6-гранная H5х75ммL,10мм	null	2.34	\N	ARRIVED	IN_STORE	\N	2025-10-14 12:25:21.374	\N	0	0	\N	9	\N	MONOLITH	f	\N
125	RF-802222-20251016-115419551-260447/child-2-1760604932524-7u7fbd4tm	27	\N	\N	2025-10-16 08:55:32.525	2025-10-16 08:55:48.576	\N	f	f	122	44	1/4" Трещотки	RF-802222		Трещотка реверсивная усиленная изогнутая с резиновой ручкой 1/4''(72зуб.)	null	9.72	\N	ARRIVED	IN_STORE	\N	2025-10-16 08:55:32.524	\N	0	0	\N	24	\N	MONOLITH	f	\N
124	RF-802222-20251016-115419551-260447/child-1-1760604932520-mp9geksqd	27	\N	\N	2025-10-16 08:55:32.521	2025-10-16 08:55:51.022	\N	f	f	122	44	1/4" Трещотки	RF-802222		Трещотка реверсивная усиленная изогнутая с резиновой ручкой 1/4''(72зуб.)	null	9.72	\N	ARRIVED	IN_STORE	\N	2025-10-16 08:55:32.52	\N	0	0	\N	24	\N	MONOLITH	f	\N
105	274300-20251015-135813836-692076/child-1-1760603186858-2rwe84gp7	19	\N	\N	2025-10-16 08:26:26.859	2025-10-16 08:26:26.859	\N	f	f	81	35	Щётки для УШМ	274300		Щётка для УШМ проволочная конусная 100мм	null	15.9	\N	IN_REQUEST	\N	\N	2025-10-16 08:26:26.858	\N	0	0	\N	17	\N	MONOLITH	f	\N
106	274300-20251015-135813836-692076/child-2-1760603186864-3fkukptez	19	\N	\N	2025-10-16 08:26:26.865	2025-10-16 08:26:26.865	\N	f	f	81	35	Щётки для УШМ	274300		Щётка для УШМ проволочная конусная 100мм	null	15.9	\N	IN_REQUEST	\N	\N	2025-10-16 08:26:26.864	\N	0	0	\N	17	\N	MONOLITH	f	\N
107	563592-20251016-112724036-828378	25	\N	\N	2025-10-16 08:27:24.037	2025-10-16 08:27:24.037	\N	f	f	\N	43	Г-образные Torx наборы	563592		Набор ключей TORX с отверстием удлинённых 9шт.	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	22	\N	MONOLITH	f	\N
141	1787512-20251016-122020781-572711/child-5-1760606620080-6k16di4bt	30	\N	\N	2025-10-16 09:23:40.081	2025-10-16 09:24:02.462	\N	f	f	135	22	10мм длинные	1787512		Бита SPLINE M12х75мм,10мм	null	3.12	\N	ARRIVED	IN_STORE	\N	2025-10-16 09:23:40.081	\N	0	0	\N	9	\N	MONOLITH	f	\N
142	1787512-20251016-122020781-572711/child-6-1760606620084-82sihiq8x	30	6	2025-10-16 09:24:45.902	2025-10-16 09:23:40.085	2025-10-16 09:24:45.903	\N	f	f	135	22	10мм длинные	1787512		Бита SPLINE M12х75мм,10мм	null	3.12	\N	ARRIVED	SOLD	\N	2025-10-16 09:23:40.084	\N	0	0	\N	9	\N	MONOLITH	f	\N
127	RF-41082-5L EURO-20251016-120421490-064344	28	260	2025-10-16 09:05:41.355	2025-10-16 09:04:21.492	2025-10-16 09:05:41.356	\N	f	f	\N	41	Наборы инструментов	RF-41082-5L EURO		Набор инструментов 108пр.1/4''&1/2''(6гр.)(4-32мм)	null	190	\N	ARRIVED	SOLD	2025-10-16 09:04:38.117	2025-10-16 09:05:05.065	\N	1	0	\N	25	\N	MONOLITH	f	\N
130	BCDA1617-20251016-121244421-486457	29	\N	\N	2025-10-16 09:12:44.423	2025-10-16 09:12:44.423	\N	f	f	\N	46	Головки биты 1/2"	BCDA1617		Головка 1/2" с насадкой HEX 17мм TOPTUL	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	26	\N	MONOLITH	f	\N
133	BCDA1617-20251016-121140082-248354/child-3-1760605964448-dndq2klnd	29	\N	\N	2025-10-16 09:12:44.449	2025-10-16 09:13:05.788	\N	f	f	129	46	Головки биты 1/2"	BCDA1617		Головка 1/2" с насадкой HEX 17мм TOPTUL	null	9.64	\N	ARRIVED	IN_STORE	\N	2025-10-16 09:12:44.448	\N	0	0	\N	26	\N	MONOLITH	f	\N
112	563592-20251016-112816497-998228/child-1-1760603386679-hukrihgem	25	\N	\N	2025-10-16 08:29:46.68	2025-10-17 09:59:40.374	\N	f	f	108	43	Г-образные Torx наборы	563592		Набор ключей TORX с отверстием удлинённых 9шт.	null	15.9	\N	IN_REQUEST	\N	\N	2025-10-16 08:29:46.679	\N	0	0	\N	22	\N	MONOLITH	f	\N
134	BCDA1617-20251016-121140082-248354/child-4-1760605964452-n1jqucd6h	29	20	2025-10-16 09:13:42.581	2025-10-16 09:12:44.453	2025-10-16 09:13:42.583	\N	f	f	129	46	Головки биты 1/2"	BCDA1617		Головка 1/2" с насадкой HEX 17мм TOPTUL	null	9.64	\N	ARRIVED	SOLD	\N	2025-10-16 09:12:44.452	\N	0	0	\N	26	\N	MONOLITH	f	\N
109	563592-20251016-112217815-339462/child-1-1760603296505-w5j6h4w85	25	\N	\N	2025-10-16 08:28:16.506	2025-10-16 08:47:39.101	\N	f	f	103	43	Г-образные Torx наборы	563592		Набор ключей TORX с отверстием удлинённых 9шт.	null	15.42	\N	IN_REQUEST	\N	\N	2025-10-16 08:28:16.505	\N	0	0	\N	22	\N	MONOLITH	f	\N
110	563592-20251016-112217815-339462/child-2-1760603296509-i5bam9dct	25	\N	\N	2025-10-16 08:28:16.51	2025-10-16 08:47:47.409	\N	f	f	103	43	Г-образные Torx наборы	563592		Набор ключей TORX с отверстием удлинённых 9шт.	null	15.42	\N	IN_REQUEST	\N	\N	2025-10-16 08:28:16.509	\N	0	0	\N	22	\N	MONOLITH	f	\N
123	RF-802222-20251016-115532498-619132	27	\N	\N	2025-10-16 08:55:32.5	2025-10-16 08:55:32.5	\N	f	f	\N	44	1/4" Трещотки	RF-802222		Трещотка реверсивная усиленная изогнутая с резиновой ручкой 1/4''(72зуб.)	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	24	\N	MONOLITH	f	\N
136	1787512-20251016-122340050-606621	30	\N	\N	2025-10-16 09:23:40.051	2025-10-16 09:23:40.051	\N	f	f	\N	22	10мм длинные	1787512		Бита SPLINE M12х75мм,10мм	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	9	\N	MONOLITH	f	\N
135	1787512-20251016-122020781-572711	30	\N	\N	2025-10-16 09:20:20.782	2025-10-16 09:23:40.066	\N	f	f	\N	22	10мм длинные	1787512		Бита SPLINE M12х75мм,10мм	null	\N	\N	SPROUTED	\N	2025-10-16 09:22:52.69	\N	\N	1	0	\N	9	\N	MONOLITH	f	\N
144	F-61804-20251016-123120142-818399	31	\N	\N	2025-10-16 09:31:20.144	2025-10-16 09:31:20.144	\N	f	f	\N	49	Щупы, шаблоны	F-61804		Набор щупов 32пр. (0.04-0.88мм), в чехле	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	27	\N	MONOLITH	f	\N
113	563592-20251016-112816497-998228/child-2-1760603386682-ie4bty4s1	25	22	2025-10-17 09:59:16.524	2025-10-16 08:29:46.683	2025-10-17 09:59:16.525	\N	f	f	108	43	Г-образные Torx наборы	563592		Набор ключей TORX с отверстием удлинённых 9шт.	null	15.9	\N	ARRIVED	SOLD	\N	2025-10-16 08:29:46.682	\N	0	0	\N	22	\N	MONOLITH	f	\N
140	1787512-20251016-122020781-572711/child-4-1760606620077-7eetgsm11	30	\N	\N	2025-10-16 09:23:40.078	2025-10-16 09:24:04.415	\N	f	f	135	22	10мм длинные	1787512		Бита SPLINE M12х75мм,10мм	null	3.12	\N	ARRIVED	IN_STORE	\N	2025-10-16 09:23:40.077	\N	0	0	\N	9	\N	MONOLITH	f	\N
139	1787512-20251016-122020781-572711/child-3-1760606620074-u3iq6y956	30	\N	\N	2025-10-16 09:23:40.075	2025-10-16 09:24:09.725	\N	f	f	135	22	10мм длинные	1787512		Бита SPLINE M12х75мм,10мм	null	3.12	\N	ARRIVED	IN_STORE	\N	2025-10-16 09:23:40.075	\N	0	0	\N	9	\N	MONOLITH	f	\N
138	1787512-20251016-122020781-572711/child-2-1760606620071-utl993q9l	30	\N	\N	2025-10-16 09:23:40.072	2025-10-16 09:24:12.799	\N	f	f	135	22	10мм длинные	1787512		Бита SPLINE M12х75мм,10мм	null	3.12	\N	ARRIVED	IN_STORE	\N	2025-10-16 09:23:40.071	\N	0	0	\N	9	\N	MONOLITH	f	\N
137	1787512-20251016-122020781-572711/child-1-1760606620068-wya6mjwnc	30	\N	\N	2025-10-16 09:23:40.069	2025-10-16 09:24:16.101	\N	f	f	135	22	10мм длинные	1787512		Бита SPLINE M12х75мм,10мм	null	3.12	\N	ARRIVED	IN_STORE	\N	2025-10-16 09:23:40.068	\N	0	0	\N	9	\N	MONOLITH	f	\N
146	610 008-20251017-095855062-804593	32	\N	\N	2025-10-17 06:58:55.064	2025-10-17 06:58:55.064	\N	f	f	\N	50	3/8" короткие	610 008		Головка шестигранная 8мм 3/8"	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	28	\N	MONOLITH	f	\N
143	F-61804-20251016-123049019-873137	31	17	2025-10-16 09:32:05.716	2025-10-16 09:30:49.02	2025-10-16 09:32:05.718	\N	f	f	\N	49	Щупы, шаблоны	F-61804		Набор щупов 32пр. (0.04-0.88мм), в чехле	null	11.4	\N	ARRIVED	SOLD	2025-10-16 09:30:58.291	2025-10-16 09:31:20.147	\N	1	0	\N	27	\N	MONOLITH	f	\N
145	610 008-20251017-095755024-242047	32	\N	\N	2025-10-17 06:57:55.026	2025-10-17 06:58:55.072	\N	f	f	\N	50	3/8" короткие	610 008		Головка шестигранная 8мм 3/8"	null	\N	\N	SPROUTED	\N	2025-10-17 06:58:06.195	\N	\N	1	0	\N	28	\N	MONOLITH	f	\N
148	610 008-20251017-095755024-242047/child-2-1760684335078-dryepi6xz	32	\N	\N	2025-10-17 06:58:55.079	2025-10-17 06:58:55.079	\N	f	f	145	50	3/8" короткие	610 008		Головка шестигранная 8мм 3/8"	null	1.68	\N	IN_REQUEST	\N	\N	2025-10-17 06:58:55.078	\N	0	0	\N	28	\N	MONOLITH	f	\N
108	563592-20251016-112816497-998228	25	\N	\N	2025-10-16 08:28:16.498	2025-10-16 08:29:46.678	\N	f	f	\N	43	Г-образные Torx наборы	563592		Набор ключей TORX с отверстием удлинённых 9шт.	null	\N	\N	SPROUTED	\N	2025-10-16 08:29:14.973	\N	\N	1	0	\N	22	\N	MONOLITH	f	\N
128	RF-41082-5L EURO-20251016-120505056-995086	28	\N	\N	2025-10-16 09:05:05.058	2025-10-16 09:05:05.058	\N	f	f	\N	41	Наборы инструментов	RF-41082-5L EURO		Набор инструментов 108пр.1/4''&1/2''(6гр.)(4-32мм)	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	25	\N	MONOLITH	f	\N
49	FK-4158-20251015-123126577-697238	13	35	2025-10-15 09:32:32.407	2025-10-15 09:31:26.578	2025-10-15 09:32:32.411	\N	f	f	\N	24	Набор головок Е-профиль	FK-4158		Набор головок Е-профиль,14пр(1/4'':Е4,5,6,7,8, 3/8:Е10,11,12,14, 1/2'':Е16,18,20,22,24),на планке	null	22.5	\N	ARRIVED	SOLD	2025-10-15 09:31:35.19	2025-10-15 09:31:51.07	\N	1	0	\N	11	\N	MONOLITH	f	\N
48	JCB-5457717-20251015-121953793-690614	12	\N	\N	2025-10-15 09:19:53.795	2025-10-15 09:19:53.795	\N	f	f	\N	23	1/2" глубокие	JCB-5457717		Головка глубокая 17мм (6гр.), 1/2''	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	10	\N	MONOLITH	f	\N
52	CAEA1612-20251015-124005534-983581	14	\N	\N	2025-10-15 09:40:05.536	2025-10-15 10:01:59.711	\N	f	f	\N	27	Адаптер-переходник 1/2''(F) x 3/8''(M)	CAEA1612	(F) - отверстие\r\n(M) - шток\r\nПереходник TOPTUL 12 F x 38 М (CAEA1612) используется для присоединения головок с квадратом 38 к трещоткам и вороткам с квадратом 12. Рекомендуется для профессионального использования.	Переходник 1/2"(F)х3/8(М) TOPTUL	null	\N	\N	SPROUTED	\N	2025-10-15 10:00:29.752	\N	\N	1	0	\N	12	\N	MONOLITH	f	\N
47	JCB-5457717-20251015-121920270-239709	12	8	2025-10-15 09:20:40.429	2025-10-15 09:19:20.271	2025-10-15 09:20:40.43	\N	f	f	\N	23	1/2" глубокие	JCB-5457717		Головка глубокая 17мм (6гр.), 1/2''	null	3.06	\N	ARRIVED	SOLD	2025-10-15 09:19:33.82	2025-10-15 09:19:53.798	\N	1	0	\N	10	\N	MONOLITH	f	\N
50	FK-4158-20251015-123151055-899754	13	\N	\N	2025-10-15 09:31:51.058	2025-10-15 09:31:51.058	\N	f	f	\N	24	Набор головок Е-профиль	FK-4158		Набор головок Е-профиль,14пр(1/4'':Е4,5,6,7,8, 3/8:Е10,11,12,14, 1/2'':Е16,18,20,22,24),на планке	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	11	\N	MONOLITH	f	\N
58	CAEA1612-20251015-124005534-983581/child-2-1760522519716-ai6qpxuwy	14	\N	\N	2025-10-15 10:01:59.718	2025-10-15 10:01:59.718	\N	f	f	52	27	Адаптер-переходник 1/2''(F) x 3/8''(M)	CAEA1612	(F) - отверстие\r\n(M) - шток\r\nПереходник TOPTUL 12 F x 38 М (CAEA1612) используется для присоединения головок с квадратом 38 к трещоткам и вороткам с квадратом 12. Рекомендуется для профессионального использования.	Переходник 1/2"(F)х3/8(М) TOPTUL	null	3.37	\N	IN_REQUEST	\N	\N	2025-10-15 10:01:59.717	\N	0	0	\N	12	\N	MONOLITH	f	\N
59	CAEA1612-20251015-124005534-983581/child-3-1760522519720-l5rdqxlo2	14	\N	\N	2025-10-15 10:01:59.721	2025-10-15 10:01:59.721	\N	f	f	52	27	Адаптер-переходник 1/2''(F) x 3/8''(M)	CAEA1612	(F) - отверстие\r\n(M) - шток\r\nПереходник TOPTUL 12 F x 38 М (CAEA1612) используется для присоединения головок с квадратом 38 к трещоткам и вороткам с квадратом 12. Рекомендуется для профессионального использования.	Переходник 1/2"(F)х3/8(М) TOPTUL	null	3.37	\N	IN_REQUEST	\N	\N	2025-10-15 10:01:59.72	\N	0	0	\N	12	\N	MONOLITH	f	\N
53	805382-20251015-124719211-981420	15	20	2025-10-15 09:49:52.166	2025-10-15 09:47:19.212	2025-10-15 09:49:52.167	\N	f	f	\N	29	Шкивы и Шестерни	805382		Ключ шкива коленвала 36×38 мм (112171)	null	14.58	\N	ARRIVED	SOLD	2025-10-15 09:47:27.172	2025-10-15 09:48:24.468	\N	1	0	\N	13	\N	MONOLITH	f	\N
63	825206-20251015-131411118-777838/child-2-1760523437037-56tseoygl	16	\N	\N	2025-10-15 10:17:17.038	2025-10-15 10:19:42.648	\N	f	f	60	31	Пистонодеры	825206		Съёмник пистонов обшивки изогнутый 6мм	null	5.76	\N	IN_REQUEST	\N	\N	2025-10-15 10:17:17.037	\N	0	0	\N	14	\N	MONOLITH	f	\N
51	CAEA1612-20251015-123931181-383215	14	5	2025-10-15 09:41:46.274	2025-10-15 09:39:31.182	2025-10-15 09:41:46.275	\N	f	f	\N	27	Адаптер-переходник 1/2''(F) x 3/8''(M)	CAEA1612	(F) - отверстие\r\n(M) - шток\r\nПереходник TOPTUL 12 F x 38 М (CAEA1612) используется для присоединения головок с квадратом 38 к трещоткам и вороткам с квадратом 12. Рекомендуется для профессионального использования.	Переходник 1/2"(F)х3/8(М) TOPTUL	null	3.77	\N	ARRIVED	SOLD	2025-10-15 09:39:47.646	2025-10-15 09:40:05.548	\N	1	0	\N	12	\N	MONOLITH	f	\N
57	CAEA1612-20251015-124005534-983581/child-1-1760522519713-kntwy28id	14	\N	\N	2025-10-15 10:01:59.714	2025-10-15 10:02:52.881	\N	f	f	52	27	Адаптер-переходник 1/2''(F) x 3/8''(M)	CAEA1612	(F) - отверстие\r\n(M) - шток\r\nПереходник TOPTUL 12 F x 38 М (CAEA1612) используется для присоединения головок с квадратом 38 к трещоткам и вороткам с квадратом 12. Рекомендуется для профессионального использования.	Переходник 1/2"(F)х3/8(М) TOPTUL	null	3.37	\N	ARRIVED	IN_STORE	\N	2025-10-15 10:01:59.713	\N	0	0	\N	12	\N	MONOLITH	f	\N
55	805382-20251015-125455822-243151	15	\N	\N	2025-10-15 09:54:55.824	2025-10-15 09:54:55.824	\N	f	f	\N	29	Шкивы и Шестерни	805382		Ключ шкива коленвала 36×38 мм (112171)	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	13	\N	MONOLITH	f	\N
54	805382-20251015-124824453-050655	15	\N	\N	2025-10-15 09:48:24.455	2025-10-15 09:54:55.829	\N	f	f	\N	29	Шкивы и Шестерни	805382		Ключ шкива коленвала 36×38 мм (112171)	null	14.58	\N	IN_REQUEST	\N	2025-10-15 09:54:39.172	2025-10-15 09:54:55.828	\N	1	0	\N	13	\N	MONOLITH	f	\N
61	825206-20251015-131717023-029652	16	\N	\N	2025-10-15 10:17:17.025	2025-10-15 10:17:17.025	\N	f	f	\N	31	Пистонодеры	825206		Съёмник пистонов обшивки изогнутый 6мм	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	14	\N	MONOLITH	f	\N
56	CAEA1612-20251015-130159694-285550	14	\N	\N	2025-10-15 10:01:59.695	2025-10-15 10:01:59.695	\N	f	f	\N	27	Адаптер-переходник 1/2''(F) x 3/8''(M)	CAEA1612	(F) - отверстие\r\n(M) - шток\r\nПереходник TOPTUL 12 F x 38 М (CAEA1612) используется для присоединения головок с квадратом 38 к трещоткам и вороткам с квадратом 12. Рекомендуется для профессионального использования.	Переходник 1/2"(F)х3/8(М) TOPTUL	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	12	\N	MONOLITH	f	\N
60	825206-20251015-131411118-777838	16	\N	\N	2025-10-15 10:14:11.119	2025-10-15 10:17:17.031	\N	f	f	\N	31	Пистонодеры	825206		Съёмник пистонов обшивки изогнутый 6мм	null	\N	\N	SPROUTED	\N	2025-10-15 10:14:36.044	\N	\N	1	0	\N	14	\N	MONOLITH	f	\N
62	825206-20251015-131411118-777838/child-1-1760523437033-poeuxf9pe	16	\N	\N	2025-10-15 10:17:17.034	2025-10-15 10:17:59.864	\N	f	f	60	31	Пистонодеры	825206		Съёмник пистонов обшивки изогнутый 6мм	null	5.76	\N	ARRIVED	IN_STORE	\N	2025-10-15 10:17:17.033	\N	0	0	\N	14	\N	MONOLITH	f	\N
85	274300-20251015-135916951-099046/child-2-1760526018822-t5tmn3rpw	19	\N	\N	2025-10-15 11:00:18.823	2025-10-15 11:00:18.823	\N	f	f	82	35	Щётки для УШМ	274300		Щётка для УШМ проволочная конусная 100мм	null	8.04	\N	IN_REQUEST	\N	\N	2025-10-15 11:00:18.822	\N	0	0	\N	17	\N	MONOLITH	f	\N
65	825206-20251015-131411118-777838/child-4-1760523437043-8j3ikhh7j	16	10	2025-10-15 10:18:34.805	2025-10-15 10:17:17.044	2025-10-15 10:18:34.806	\N	f	f	60	31	Пистонодеры	825206		Съёмник пистонов обшивки изогнутый 6мм	null	5.76	\N	ARRIVED	SOLD	\N	2025-10-15 10:17:17.043	\N	0	0	\N	14	\N	MONOLITH	f	\N
64	825206-20251015-131411118-777838/child-3-1760523437040-gyggi7xrp	16	\N	\N	2025-10-15 10:17:17.041	2025-10-15 10:19:33.037	\N	f	f	60	31	Пистонодеры	825206		Съёмник пистонов обшивки изогнутый 6мм	null	5.76	\N	IN_REQUEST	\N	\N	2025-10-15 10:17:17.04	\N	0	0	\N	14	\N	MONOLITH	f	\N
80	322322-20251015-134644384-566058/child-6-1760525269414-emf31kzt1	18	\N	\N	2025-10-15 10:47:49.414	2025-10-15 10:47:58.77	\N	f	f	73	33	биты-поштучно	322322		Головка-бита Pozidriv PZ.2 1/4'' FORCE 322322	null	2.16	\N	ARRIVED	IN_STORE	\N	2025-10-15 10:47:49.414	\N	0	0	\N	16	\N	MONOLITH	f	\N
67	321321-20251015-134344589-516171	17	\N	\N	2025-10-15 10:43:44.591	2025-10-15 10:43:44.591	\N	f	f	\N	33	биты-поштучно	321321		Головка-бита Philips PH.1 1/4'' FORCE 321321	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	15	\N	MONOLITH	f	\N
66	321321-20251015-134231709-235483	17	\N	\N	2025-10-15 10:42:31.711	2025-10-15 10:43:44.606	\N	f	f	\N	33	биты-поштучно	321321		Головка-бита Philips PH.1 1/4'' FORCE 321321	null	\N	\N	SPROUTED	\N	2025-10-15 10:42:43.964	\N	\N	1	0	\N	15	\N	MONOLITH	f	\N
68	321321-20251015-134231709-235483/child-1-1760525024608-47uf6v06k	17	\N	\N	2025-10-15 10:43:44.609	2025-10-15 10:44:09.069	\N	f	f	66	33	биты-поштучно	321321		Головка-бита Philips PH.1 1/4'' FORCE 321321	null	2.16	\N	ARRIVED	IN_STORE	\N	2025-10-15 10:43:44.608	\N	0	0	\N	15	\N	MONOLITH	f	\N
72	321321-20251015-134231709-235483/child-5-1760525024619-vuww7g098	17	\N	\N	2025-10-15 10:43:44.62	2025-10-15 10:43:59.302	\N	f	f	66	33	биты-поштучно	321321		Головка-бита Philips PH.1 1/4'' FORCE 321321	null	2.16	\N	ARRIVED	IN_STORE	\N	2025-10-15 10:43:44.62	\N	0	0	\N	15	\N	MONOLITH	f	\N
74	322322-20251015-134749381-117237	18	\N	\N	2025-10-15 10:47:49.382	2025-10-15 10:47:49.382	\N	f	f	\N	33	биты-поштучно	322322		Головка-бита Pozidriv PZ.2 1/4'' FORCE 322322	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	16	\N	MONOLITH	f	\N
71	321321-20251015-134231709-235483/child-4-1760525024617-0m3j9gsfl	17	\N	\N	2025-10-15 10:43:44.618	2025-10-15 10:44:01.968	\N	f	f	66	33	биты-поштучно	321321		Головка-бита Philips PH.1 1/4'' FORCE 321321	null	2.16	\N	ARRIVED	IN_STORE	\N	2025-10-15 10:43:44.617	\N	0	0	\N	15	\N	MONOLITH	f	\N
73	322322-20251015-134644384-566058	18	\N	\N	2025-10-15 10:46:44.385	2025-10-15 10:47:49.396	\N	f	f	\N	33	биты-поштучно	322322		Головка-бита Pozidriv PZ.2 1/4'' FORCE 322322	null	\N	\N	SPROUTED	\N	2025-10-15 10:47:00.863	\N	\N	1	0	\N	16	\N	MONOLITH	f	\N
75	322322-20251015-134644384-566058/child-1-1760525269398-ga411n4lc	18	\N	\N	2025-10-15 10:47:49.399	2025-10-15 10:47:49.399	\N	f	f	73	33	биты-поштучно	322322		Головка-бита Pozidriv PZ.2 1/4'' FORCE 322322	null	2.16	\N	IN_REQUEST	\N	\N	2025-10-15 10:47:49.398	\N	0	0	\N	16	\N	MONOLITH	f	\N
70	321321-20251015-134231709-235483/child-3-1760525024614-918qzgq3l	17	\N	\N	2025-10-15 10:43:44.615	2025-10-15 10:44:04.231	\N	f	f	66	33	биты-поштучно	321321		Головка-бита Philips PH.1 1/4'' FORCE 321321	null	2.16	\N	ARRIVED	IN_STORE	\N	2025-10-15 10:43:44.614	\N	0	0	\N	15	\N	MONOLITH	f	\N
69	321321-20251015-134231709-235483/child-2-1760525024611-jji2xzpn3	17	\N	\N	2025-10-15 10:43:44.612	2025-10-15 10:44:06.57	\N	f	f	66	33	биты-поштучно	321321		Головка-бита Philips PH.1 1/4'' FORCE 321321	null	2.16	\N	ARRIVED	IN_STORE	\N	2025-10-15 10:43:44.611	\N	0	0	\N	15	\N	MONOLITH	f	\N
76	322322-20251015-134644384-566058/child-2-1760525269401-56jiqbmim	18	\N	\N	2025-10-15 10:47:49.402	2025-10-15 10:47:49.402	\N	f	f	73	33	биты-поштучно	322322		Головка-бита Pozidriv PZ.2 1/4'' FORCE 322322	null	2.16	\N	IN_REQUEST	\N	\N	2025-10-15 10:47:49.401	\N	0	0	\N	16	\N	MONOLITH	f	\N
77	322322-20251015-134644384-566058/child-3-1760525269404-pf0b9sjvd	18	\N	\N	2025-10-15 10:47:49.406	2025-10-15 10:47:49.406	\N	f	f	73	33	биты-поштучно	322322		Головка-бита Pozidriv PZ.2 1/4'' FORCE 322322	null	2.16	\N	IN_REQUEST	\N	\N	2025-10-15 10:47:49.405	\N	0	0	\N	16	\N	MONOLITH	f	\N
78	322322-20251015-134644384-566058/child-4-1760525269408-kr5wr5ds0	18	\N	\N	2025-10-15 10:47:49.409	2025-10-15 10:47:49.409	\N	f	f	73	33	биты-поштучно	322322		Головка-бита Pozidriv PZ.2 1/4'' FORCE 322322	null	2.16	\N	IN_REQUEST	\N	\N	2025-10-15 10:47:49.408	\N	0	0	\N	16	\N	MONOLITH	f	\N
79	322322-20251015-134644384-566058/child-5-1760525269411-8efkanxyx	18	\N	\N	2025-10-15 10:47:49.412	2025-10-15 10:47:49.412	\N	f	f	73	33	биты-поштучно	322322		Головка-бита Pozidriv PZ.2 1/4'' FORCE 322322	null	2.16	\N	IN_REQUEST	\N	\N	2025-10-15 10:47:49.411	\N	0	0	\N	16	\N	MONOLITH	f	\N
86	274300-20251015-135916951-099046/child-3-1760526018827-cn8ck9nf6	19	\N	\N	2025-10-15 11:00:18.828	2025-10-15 11:00:18.828	\N	f	f	82	35	Щётки для УШМ	274300		Щётка для УШМ проволочная конусная 100мм	null	8.04	\N	IN_REQUEST	\N	\N	2025-10-15 11:00:18.827	\N	0	0	\N	17	\N	MONOLITH	f	\N
87	274325-20251015-140249886-781428	20	\N	\N	2025-10-15 11:02:49.887	2025-10-15 11:03:54.19	\N	f	f	\N	35	Щётки для УШМ	274325		Щётка для УШМ проволочная конусная 125мм	null	\N	\N	SPROUTED	\N	2025-10-15 11:03:01.87	\N	\N	1	0	\N	17	\N	MONOLITH	f	\N
83	274300-20251015-140018800-517077	19	\N	\N	2025-10-15 11:00:18.802	2025-10-15 11:00:18.802	\N	f	f	\N	35	Щётки для УШМ	274300		Щётка для УШМ проволочная конусная 100мм	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	17	\N	MONOLITH	f	\N
82	274300-20251015-135916951-099046	19	\N	\N	2025-10-15 10:59:16.952	2025-10-15 11:00:18.817	\N	f	f	\N	35	Щётки для УШМ	274300		Щётка для УШМ проволочная конусная 100мм	null	\N	\N	SPROUTED	\N	2025-10-15 10:59:52.703	\N	\N	1	0	\N	17	\N	MONOLITH	f	\N
84	274300-20251015-135916951-099046/child-1-1760526018819-5fpk5ipd5	19	\N	\N	2025-10-15 11:00:18.82	2025-10-15 11:00:18.82	\N	f	f	82	35	Щётки для УШМ	274300		Щётка для УШМ проволочная конусная 100мм	null	8.04	\N	IN_REQUEST	\N	\N	2025-10-15 11:00:18.819	\N	0	0	\N	17	\N	MONOLITH	f	\N
81	274300-20251015-135813836-692076	19	\N	\N	2025-10-15 10:58:13.837	2025-10-16 08:26:26.839	\N	f	f	\N	35	Щётки для УШМ	274300		Щётка для УШМ проволочная конусная 100мм	null	\N	\N	SPROUTED	\N	2025-10-15 10:59:35.641	\N	\N	1	0	\N	17	\N	MONOLITH	f	\N
88	274325-20251015-140354175-942467	20	\N	\N	2025-10-15 11:03:54.177	2025-10-15 11:03:54.177	\N	f	f	\N	35	Щётки для УШМ	274325		Щётка для УШМ проволочная конусная 125мм	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	17	\N	MONOLITH	f	\N
89	274325-20251015-140249886-781428/child-1-1760526234192-turyr34u1	20	\N	\N	2025-10-15 11:03:54.193	2025-10-15 11:03:54.193	\N	f	f	87	35	Щётки для УШМ	274325		Щётка для УШМ проволочная конусная 125мм	null	10.5	\N	IN_REQUEST	\N	\N	2025-10-15 11:03:54.192	\N	0	0	\N	17	\N	MONOLITH	f	\N
90	274325-20251015-140249886-781428/child-2-1760526234195-l2g96s1qx	20	\N	\N	2025-10-15 11:03:54.196	2025-10-15 11:03:54.196	\N	f	f	87	35	Щётки для УШМ	274325		Щётка для УШМ проволочная конусная 125мм	null	10.5	\N	IN_REQUEST	\N	\N	2025-10-15 11:03:54.195	\N	0	0	\N	17	\N	MONOLITH	f	\N
91	274325-20251015-140249886-781428/child-3-1760526234198-8ppf90mdh	20	\N	\N	2025-10-15 11:03:54.199	2025-10-15 11:03:54.199	\N	f	f	87	35	Щётки для УШМ	274325		Щётка для УШМ проволочная конусная 125мм	null	10.5	\N	IN_REQUEST	\N	\N	2025-10-15 11:03:54.198	\N	0	0	\N	17	\N	MONOLITH	f	\N
93	44019-20251015-141751242-774407	21	\N	\N	2025-10-15 11:17:51.244	2025-10-15 11:17:51.244	\N	f	f	\N	36	Щетки на дрель (набор)	44019		Набор щеток зачистных для дрели 3 шт., 25/50/50 мм АвтоDело 44019 10276	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	18	\N	MONOLITH	f	\N
92	44019-20251015-141659065-235687	21	\N	\N	2025-10-15 11:16:59.067	2025-10-15 11:17:51.258	\N	f	f	\N	36	Щетки на дрель (набор)	44019		Набор щеток зачистных для дрели 3 шт., 25/50/50 мм АвтоDело 44019 10276	null	\N	\N	SPROUTED	\N	2025-10-15 11:17:12.363	\N	\N	1	0	\N	18	\N	MONOLITH	f	\N
94	44019-20251015-141659065-235687/child-1-1760527071260-wejt25mat	21	\N	\N	2025-10-15 11:17:51.261	2025-10-15 11:17:51.261	\N	f	f	92	36	Щетки на дрель (набор)	44019		Набор щеток зачистных для дрели 3 шт., 25/50/50 мм АвтоDело 44019 10276	null	7.02	\N	IN_REQUEST	\N	\N	2025-10-15 11:17:51.26	\N	0	0	\N	18	\N	MONOLITH	f	\N
95	44019-20251015-141659065-235687/child-2-1760527071263-7gkwlwy94	21	\N	\N	2025-10-15 11:17:51.264	2025-10-15 11:17:51.264	\N	f	f	92	36	Щетки на дрель (набор)	44019		Набор щеток зачистных для дрели 3 шт., 25/50/50 мм АвтоDело 44019 10276	null	7.02	\N	IN_REQUEST	\N	\N	2025-10-15 11:17:51.263	\N	0	0	\N	18	\N	MONOLITH	f	\N
96	44019-20251015-141659065-235687/child-3-1760527071267-cr2dxrjmj	21	\N	\N	2025-10-15 11:17:51.268	2025-10-15 11:17:51.268	\N	f	f	92	36	Щетки на дрель (набор)	44019		Набор щеток зачистных для дрели 3 шт., 25/50/50 мм АвтоDело 44019 10276	null	7.02	\N	IN_REQUEST	\N	\N	2025-10-15 11:17:51.267	\N	0	0	\N	18	\N	MONOLITH	f	\N
119	622019-20251016-114535576-447764/child-4-1760604396676-rlz9mdi7e	26	\N	\N	2025-10-16 08:46:36.677	2025-10-16 08:46:55.235	\N	f	f	114	8	1/2" короткие	622019		Головка двенадцатигранная 19мм 1/2"	null	2.94	\N	ARRIVED	IN_STORE	\N	2025-10-16 08:46:36.676	\N	0	0	\N	23	\N	MONOLITH	f	\N
98	800410-20251015-142337184-743662	22	\N	\N	2025-10-15 11:23:37.186	2025-10-15 11:23:37.186	\N	f	f	\N	37	Съёмники масляных фильтров	800410		Съёмник масляных фильтров ременной Ø60-140 мм	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	19	\N	MONOLITH	f	\N
97	800410-20251015-142238980-405970	22	\N	\N	2025-10-15 11:22:38.981	2025-10-15 11:23:37.199	\N	f	f	\N	37	Съёмники масляных фильтров	800410		Съёмник масляных фильтров ременной Ø60-140 мм	null	35.52	\N	IN_REQUEST	\N	2025-10-15 11:22:49.761	2025-10-15 11:23:37.197	\N	1	0	\N	19	\N	MONOLITH	f	\N
114	622019-20251016-114535576-447764	26	\N	\N	2025-10-16 08:45:35.578	2025-10-16 08:46:36.664	\N	f	f	\N	8	1/2" короткие	622019		Головка двенадцатигранная 19мм 1/2"	null	\N	\N	SPROUTED	\N	2025-10-16 08:45:45.814	\N	\N	1	0	\N	23	\N	MONOLITH	f	\N
100	F-BSE1-3SM-20251015-143410844-874960	23	\N	\N	2025-10-15 11:34:10.846	2025-10-15 11:34:10.846	\N	f	f	\N	40	Быстроразъемы	F-BSE1-3SM		Быстроразъем пневматический с клапаном-наружняя резьба 3/8''	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	20	\N	MONOLITH	f	\N
101	JCB-38841-20251015-154343000-917559	24	300	2025-10-15 12:45:09.423	2025-10-15 12:43:43.002	2025-10-15 12:45:09.424	\N	f	f	\N	42	1/4" и 3/8" и 1/2"	JCB-38841		Набор инструментов 216пр. 1/4'', 3/8'', 1/2''(6гр.)(4-32мм)	null	195	\N	ARRIVED	SOLD	2025-10-15 12:43:52.952	2025-10-15 12:44:25.679	\N	1	0	\N	21	\N	MONOLITH	f	\N
99	F-BSE1-3SM-20251015-143338462-357900	23	14	2025-10-15 11:35:27.807	2025-10-15 11:33:38.464	2025-10-15 11:35:27.808	\N	f	f	\N	40	Быстроразъемы	F-BSE1-3SM		Быстроразъем пневматический с клапаном-наружняя резьба 3/8''	null	11.4	\N	ARRIVED	SOLD	2025-10-15 11:33:47.082	2025-10-15 11:34:10.858	\N	1	0	\N	20	\N	MONOLITH	f	\N
102	JCB-38841-20251015-154425666-143092	24	\N	\N	2025-10-15 12:44:25.668	2025-10-15 12:44:25.668	\N	f	f	\N	42	1/4" и 3/8" и 1/2"	JCB-38841		Набор инструментов 216пр. 1/4'', 3/8'', 1/2''(6гр.)(4-32мм)	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	21	\N	MONOLITH	f	\N
120	622019-20251016-114535576-447764/child-5-1760604396679-04y58j4o1	26	\N	\N	2025-10-16 08:46:36.68	2025-10-16 08:46:52.704	\N	f	f	114	8	1/2" короткие	622019		Головка двенадцатигранная 19мм 1/2"	null	2.94	\N	ARRIVED	IN_STORE	\N	2025-10-16 08:46:36.679	\N	0	0	\N	23	\N	MONOLITH	f	\N
118	622019-20251016-114535576-447764/child-3-1760604396673-r034ecfcr	26	\N	\N	2025-10-16 08:46:36.674	2025-10-16 08:46:58.212	\N	f	f	114	8	1/2" короткие	622019		Головка двенадцатигранная 19мм 1/2"	null	2.94	\N	ARRIVED	IN_STORE	\N	2025-10-16 08:46:36.673	\N	0	0	\N	23	\N	MONOLITH	f	\N
117	622019-20251016-114535576-447764/child-2-1760604396669-g6fkn8o88	26	\N	\N	2025-10-16 08:46:36.67	2025-10-16 08:47:01.136	\N	f	f	114	8	1/2" короткие	622019		Головка двенадцатигранная 19мм 1/2"	null	2.94	\N	ARRIVED	IN_STORE	\N	2025-10-16 08:46:36.669	\N	0	0	\N	23	\N	MONOLITH	f	\N
116	622019-20251016-114535576-447764/child-1-1760604396666-wqau6vnm0	26	\N	\N	2025-10-16 08:46:36.667	2025-10-16 08:47:03.605	\N	f	f	114	8	1/2" короткие	622019		Головка двенадцатигранная 19мм 1/2"	null	2.94	\N	ARRIVED	IN_STORE	\N	2025-10-16 08:46:36.666	\N	0	0	\N	23	\N	MONOLITH	f	\N
121	622019-20251016-114535576-447764/child-6-1760604396685-sbunk1jlh	26	7	2025-10-16 08:49:02.563	2025-10-16 08:46:36.686	2025-10-16 08:49:02.564	\N	f	f	114	8	1/2" короткие	622019		Головка двенадцатигранная 19мм 1/2"	null	2.94	\N	ARRIVED	SOLD	\N	2025-10-16 08:46:36.685	\N	0	0	\N	23	\N	MONOLITH	f	\N
129	BCDA1617-20251016-121140082-248354	29	\N	\N	2025-10-16 09:11:40.084	2025-10-16 09:12:44.438	\N	f	f	\N	46	Головки биты 1/2"	BCDA1617		Головка 1/2" с насадкой HEX 17мм TOPTUL	null	\N	\N	SPROUTED	\N	2025-10-16 09:12:16.802	\N	\N	1	0	\N	26	\N	MONOLITH	f	\N
126	RF-802222-20251016-115419551-260447/child-3-1760604932527-8qbyllwls	27	12	2025-10-16 08:56:15.573	2025-10-16 08:55:32.528	2025-10-16 08:56:15.574	\N	f	f	122	44	1/4" Трещотки	RF-802222		Трещотка реверсивная усиленная изогнутая с резиновой ручкой 1/4''(72зуб.)	null	9.72	\N	ARRIVED	SOLD	\N	2025-10-16 08:55:32.527	\N	0	0	\N	24	\N	MONOLITH	f	\N
132	BCDA1617-20251016-121140082-248354/child-2-1760605964444-l1m2n8eo1	29	\N	\N	2025-10-16 09:12:44.445	2025-10-16 09:13:08.596	\N	f	f	129	46	Головки биты 1/2"	BCDA1617		Головка 1/2" с насадкой HEX 17мм TOPTUL	null	9.64	\N	ARRIVED	IN_STORE	\N	2025-10-16 09:12:44.444	\N	0	0	\N	26	\N	MONOLITH	f	\N
131	BCDA1617-20251016-121140082-248354/child-1-1760605964440-y9l72oke5	29	\N	\N	2025-10-16 09:12:44.442	2025-10-16 09:13:11.169	\N	f	f	129	46	Головки биты 1/2"	BCDA1617		Головка 1/2" с насадкой HEX 17мм TOPTUL	null	9.64	\N	ARRIVED	IN_STORE	\N	2025-10-16 09:12:44.44	\N	0	0	\N	26	\N	MONOLITH	f	\N
147	610 008-20251017-095755024-242047/child-1-1760684335074-f47bfgnim	32	4	2025-10-17 06:59:33.8	2025-10-17 06:58:55.075	2025-10-17 06:59:33.801	\N	f	f	145	50	3/8" короткие	610 008		Головка шестигранная 8мм 3/8"	null	1.68	\N	ARRIVED	SOLD	\N	2025-10-17 06:58:55.074	\N	0	0	\N	28	\N	MONOLITH	f	\N
150	JGAW0501-20251017-100553704-490596	33	\N	\N	2025-10-17 07:05:53.71	2025-10-17 07:05:53.71	\N	f	f	\N	52	Наборы экстракторов	JGAW0501		Набор экстракторов 5шт TOPTUL	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	29	\N	MONOLITH	f	\N
153	270038-20251017-101601525-264985/child-1-1760685444769-3vqoxbkwk	34	\N	\N	2025-10-17 07:17:24.77	2025-10-17 07:17:45.434	\N	f	f	151	54	Щётки-мини	270038		Щётка-мини, нейлоновая щетина	null	1.32	\N	ARRIVED	IN_STORE	\N	2025-10-17 07:17:24.769	\N	0	0	\N	32	\N	MONOLITH	f	\N
161	816105-20251017-124950313-131002	37	30	2025-10-17 09:57:38.738	2025-10-17 09:49:50.315	2025-10-17 09:57:38.739	\N	f	f	\N	59	Специнструмент для работ со ШРУСом	816105		Клещи для хомутов ШРУСа	null	24.48	\N	ARRIVED	SOLD	2025-10-17 09:50:15.312	2025-10-17 09:57:00.163	\N	1	0	\N	38	\N	MONOLITH	f	\N
158	Sch-TAP10x1,25-20251017-112431420-636660	35	\N	\N	2025-10-17 08:24:31.422	2025-10-17 08:24:31.422	\N	f	f	\N	55	Метчики, плашки, воротки	Sch-TAP10x1,25		Метчик M10x1,25 (3шт)	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	36	\N	MONOLITH	f	\N
149	JGAW0501-20251017-100455151-327662	33	22	2025-10-17 07:06:45.921	2025-10-17 07:04:55.153	2025-10-17 07:06:45.922	\N	f	f	\N	52	Наборы экстракторов	JGAW0501		Набор экстракторов 5шт TOPTUL	null	15.61	\N	ARRIVED	SOLD	2025-10-17 07:05:28.582	2025-10-17 07:05:53.717	\N	1	0	\N	29	\N	MONOLITH	f	\N
152	270038-20251017-101724759-668663	34	\N	\N	2025-10-17 07:17:24.761	2025-10-17 07:17:24.761	\N	f	f	\N	54	Щётки-мини	270038		Щётка-мини, нейлоновая щетина	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	32	\N	MONOLITH	f	\N
151	270038-20251017-101601525-264985	34	\N	\N	2025-10-17 07:16:01.527	2025-10-17 07:17:24.767	\N	f	f	\N	54	Щётки-мини	270038		Щётка-мини, нейлоновая щетина	null	\N	\N	SPROUTED	\N	2025-10-17 07:16:16.507	\N	\N	1	0	\N	32	\N	MONOLITH	f	\N
159	F-9U0102-20251017-124105055-430025	36	30	2025-10-17 09:43:19.396	2025-10-17 09:41:05.056	2025-10-17 09:43:19.397	\N	f	f	\N	58	Суппортовые	F-9U0102		Съемник внутрених стопорных колец изогнутый 90грд. (глубина-56мм, для суппортов), в блистере	null	19.41	\N	ARRIVED	SOLD	2025-10-17 09:41:15.238	2025-10-17 09:41:58.791	\N	1	0	\N	37	\N	MONOLITH	f	\N
163	563592-20251017-130027236-404593	25	\N	\N	2025-10-17 10:00:27.238	2025-10-17 10:00:27.238	\N	f	f	\N	43	Г-образные Torx наборы	563592		Набор ключей TORX с отверстием удлинённых 9шт.	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	22	\N	MONOLITH	f	\N
157	Sch-TAP10x1,25-20251017-112201241-398772	35	10	2025-10-17 08:33:21.908	2025-10-17 08:22:01.242	2025-10-17 08:33:21.909	\N	f	f	\N	55	Метчики, плашки, воротки	Sch-TAP10x1,25		Метчик M10x1,25 (3шт)	null	5.6	\N	ARRIVED	SOLD	2025-10-17 08:22:11.494	2025-10-17 08:24:31.425	\N	1	0	\N	36	\N	MONOLITH	f	\N
155	270038-20251017-101601525-264985/child-3-1760685444776-elc9upgck	34	\N	\N	2025-10-17 07:17:24.777	2025-10-17 07:17:38.808	\N	f	f	151	54	Щётки-мини	270038		Щётка-мини, нейлоновая щетина	null	1.32	\N	ARRIVED	IN_STORE	\N	2025-10-17 07:17:24.776	\N	0	0	\N	32	\N	MONOLITH	f	\N
162	816105-20251017-125700157-249737	37	\N	\N	2025-10-17 09:57:00.159	2025-10-17 09:57:00.159	\N	f	f	\N	59	Специнструмент для работ со ШРУСом	816105		Клещи для хомутов ШРУСа	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	38	\N	MONOLITH	f	\N
154	270038-20251017-101601525-264985/child-2-1760685444773-r0z5pr9k5	34	\N	\N	2025-10-17 07:17:24.774	2025-10-17 07:17:41.117	\N	f	f	151	54	Щётки-мини	270038		Щётка-мини, нейлоновая щетина	null	1.32	\N	ARRIVED	IN_STORE	\N	2025-10-17 07:17:24.773	\N	0	0	\N	32	\N	MONOLITH	f	\N
169	F-34012829-20251018-091851686-434837	40	\N	\N	2025-10-18 06:18:51.688	2025-10-18 06:18:51.688	\N	f	f	\N	53	Щётки ручные	F-34012829		Щетка-мини по металлу ручная в пластиковом корпусе с прорезиненной рукояткой (проволока из нержавеющей стали, 3x10рядов)	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	41	\N	MONOLITH	f	\N
160	F-9U0102-20251017-124158777-240491	36	\N	\N	2025-10-17 09:41:58.778	2025-10-17 09:41:58.778	\N	f	f	\N	58	Суппортовые	F-9U0102		Съемник внутрених стопорных колец изогнутый 90грд. (глубина-56мм, для суппортов), в блистере	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	37	\N	MONOLITH	f	\N
111	563592-20251016-112946671-037269	25	\N	\N	2025-10-16 08:29:46.672	2025-10-17 10:00:27.25	\N	f	f	\N	43	Г-образные Torx наборы	563592		Набор ключей TORX с отверстием удлинённых 9шт.	null	15.84	\N	IN_REQUEST	\N	2025-10-17 09:59:52.485	2025-10-17 10:00:27.249	\N	1	0	\N	22	\N	MONOLITH	f	\N
23	622030-20251014-143845118-408920/child-2-1760441958606-66kw14n0y	4	\N	\N	2025-10-14 11:39:18.606	2025-10-17 09:42:08.61	\N	f	f	20	8	1/2" короткие	622030		Головка двенадцатигранная 30мм 1/2"	null	7.26	\N	ARRIVED	IN_STORE	\N	2025-10-14 11:39:18.606	\N	0	0	\N	4	\N	MONOLITH	f	\N
167	PRO-83008-20251017-131449792-543305	39	\N	\N	2025-10-17 10:14:49.794	2025-10-17 10:14:49.794	\N	f	f	\N	62	Ключи накидные (НАБОРЫ)	PRO-83008		Набор ключей накидн. 6-22мм 8шт PRO STARTUL GT (PRO-83008) (пласт. подвес)	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	40	\N	MONOLITH	f	\N
166	PRO-83008-20251017-131416317-135234	39	52	2025-10-17 10:16:22.37	2025-10-17 10:14:16.319	2025-10-17 10:16:22.371	\N	f	f	\N	62	Ключи накидные (НАБОРЫ)	PRO-83008		Набор ключей накидн. 6-22мм 8шт PRO STARTUL GT (PRO-83008) (пласт. подвес)	null	40.57	\N	ARRIVED	SOLD	2025-10-17 10:14:26.155	2025-10-17 10:14:49.827	\N	1	0	\N	40	\N	MONOLITH	f	\N
156	270038-20251017-101601525-264985/child-4-1760685444779-dyy9j6844	34	3	2025-10-18 06:12:17.715	2025-10-17 07:17:24.78	2025-10-18 06:12:17.717	\N	f	f	151	54	Щётки-мини	270038		Щётка-мини, нейлоновая щетина	null	1.32	\N	ARRIVED	SOLD	\N	2025-10-17 07:17:24.779	\N	0	0	\N	32	\N	MONOLITH	f	\N
165	RF-1022-34-20251017-130937581-175962	38	\N	\N	2025-10-17 10:09:37.583	2025-10-17 10:09:37.583	\N	f	f	\N	61	Съемники амортизаторов и стоек	RF-1022-34		Вставка для разборки стойки амортизатора (Nissan) 4мм Rock FORCE RF-1022-34	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	39	\N	MONOLITH	f	\N
164	RF-1022-34-20251017-130911439-664989	38	15	2025-10-17 10:10:09.78	2025-10-17 10:09:11.44	2025-10-17 10:10:09.781	\N	f	f	\N	61	Съемники амортизаторов и стоек	RF-1022-34		Вставка для разборки стойки амортизатора (Nissan) 4мм Rock FORCE RF-1022-34	null	9.15	\N	ARRIVED	SOLD	2025-10-17 10:09:19.532	2025-10-17 10:09:37.595	\N	1	0	\N	39	\N	MONOLITH	f	\N
168	F-34012829-20251018-091821303-202827	40	6	2025-10-18 06:19:33.572	2025-10-18 06:18:21.305	2025-10-18 06:19:33.573	\N	f	f	\N	53	Щётки ручные	F-34012829		Щетка-мини по металлу ручная в пластиковом корпусе с прорезиненной рукояткой (проволока из нержавеющей стали, 3x10рядов)	null	4.5	\N	ARRIVED	SOLD	2025-10-18 06:18:29.867	2025-10-18 06:18:51.701	\N	1	0	\N	41	\N	MONOLITH	f	\N
170	Scheppach-20251018-093003037-523056	41	\N	\N	2025-10-18 06:30:03.039	2025-10-18 06:39:17.717	\N	f	f	\N	55	Метчики, плашки, воротки	Scheppach		Метчик M8x1,25 (3шт)	null	\N	\N	CANDIDATE	\N	2025-10-18 06:39:17.715	\N	\N	1	0	\N	42	\N	MONOLITH	f	\N
182	GP5016-80-20251018-102600132-169626/child-1-1760772420637-a2cg3rurj	46	\N	\N	2025-10-18 07:27:00.638	2025-10-18 07:27:00.638	\N	f	f	180	63	Круги лепестковые ф125мм	GP5016-80		Круг лепестковый 125х22мм P80 плоск. GEPARD (GP5016-80) (плоский КЛТ-1)	null	2.05	\N	IN_REQUEST	\N	\N	2025-10-18 07:27:00.637	\N	0	0	\N	47	\N	MONOLITH	f	\N
172	Метчик M9x1 (3шт)-20251018-094302622-387284	42	\N	\N	2025-10-18 06:43:02.623	2025-10-18 06:43:02.623	\N	f	f	\N	55	Метчики, плашки, воротки	Метчик M9x1 (3шт)		Метчик M9x1 (3шт)	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	43	\N	MONOLITH	f	\N
178	Sch-TAP10x1,5-20251018-095459527-165120	45	\N	\N	2025-10-18 06:54:59.529	2025-10-18 06:54:59.529	\N	f	f	\N	55	Метчики, плашки, воротки	Sch-TAP10x1,5	ОСТАТОК ФОРСАЖ 1шт	Метчик M10x1,5 (3шт)	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	46	\N	MONOLITH	f	\N
183	GP5016-80-20251018-102600132-169626/child-2-1760772420640-hdenk2jr2	46	\N	\N	2025-10-18 07:27:00.641	2025-10-18 07:27:00.641	\N	f	f	180	63	Круги лепестковые ф125мм	GP5016-80		Круг лепестковый 125х22мм P80 плоск. GEPARD (GP5016-80) (плоский КЛТ-1)	null	2.05	\N	IN_REQUEST	\N	\N	2025-10-18 07:27:00.64	\N	0	0	\N	47	\N	MONOLITH	f	\N
184	GP5016-80-20251018-102600132-169626/child-3-1760772420643-bd1s7cuhl	46	\N	\N	2025-10-18 07:27:00.644	2025-10-18 07:27:00.644	\N	f	f	180	63	Круги лепестковые ф125мм	GP5016-80		Круг лепестковый 125х22мм P80 плоск. GEPARD (GP5016-80) (плоский КЛТ-1)	null	2.05	\N	IN_REQUEST	\N	\N	2025-10-18 07:27:00.643	\N	0	0	\N	47	\N	MONOLITH	f	\N
171	Метчик M9x1 (3шт)-20251018-094221619-081665	42	\N	\N	2025-10-18 06:42:21.62	2025-10-18 06:43:17.837	\N	f	f	\N	55	Метчики, плашки, воротки	Метчик M9x1 (3шт)		Метчик M9x1 (3шт)	null	5.25	\N	ARRIVED	IN_STORE	2025-10-18 06:42:32.99	2025-10-18 06:43:02.634	\N	1	0	\N	43	\N	MONOLITH	f	\N
185	GP5016-80-20251018-102600132-169626/child-4-1760772420646-t15x4it5x	46	\N	\N	2025-10-18 07:27:00.647	2025-10-18 07:27:00.647	\N	f	f	180	63	Круги лепестковые ф125мм	GP5016-80		Круг лепестковый 125х22мм P80 плоск. GEPARD (GP5016-80) (плоский КЛТ-1)	null	2.05	\N	IN_REQUEST	\N	\N	2025-10-18 07:27:00.646	\N	0	0	\N	47	\N	MONOLITH	f	\N
174	76617-20251018-094711975-923630	43	\N	\N	2025-10-18 06:47:11.977	2025-10-18 06:47:11.977	\N	f	f	\N	55	Метчики, плашки, воротки	76617		Метчик ручной М6 х 1,0 мм. комплект из 2 шт. Сибртех 76617	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	44	\N	MONOLITH	f	\N
173	76617-20251018-094600393-586489	43	\N	\N	2025-10-18 06:46:00.394	2025-10-18 06:47:11.991	\N	f	f	\N	55	Метчики, плашки, воротки	76617		Метчик ручной М6 х 1,0 мм. комплект из 2 шт. Сибртех 76617	null	\N	\N	SPROUTED	\N	2025-10-18 06:46:14.981	\N	\N	1	0	\N	44	\N	MONOLITH	f	\N
177	Sch-TAP10x1,5-20251018-095423832-258317	45	\N	\N	2025-10-18 06:54:23.834	2025-10-18 06:55:16.995	\N	f	f	\N	55	Метчики, плашки, воротки	Sch-TAP10x1,5	ОСТАТОК ФОРСАЖ 1шт	Метчик M10x1,5 (3шт)	null	5.16	\N	ARRIVED	IN_STORE	2025-10-18 06:54:32.746	2025-10-18 06:54:59.541	\N	1	0	\N	46	\N	MONOLITH	f	\N
175	76617-20251018-094600393-586489/child-1-1760770031993-g7r0rl12r	43	\N	\N	2025-10-18 06:47:11.994	2025-10-18 06:47:22.253	\N	f	f	173	55	Метчики, плашки, воротки	76617		Метчик ручной М6 х 1,0 мм. комплект из 2 шт. Сибртех 76617	null	5.7	\N	ARRIVED	IN_STORE	\N	2025-10-18 06:47:11.993	\N	0	0	\N	44	\N	MONOLITH	f	\N
186	GP5016-80-20251018-102600132-169626/child-5-1760772420649-g0pcddket	46	\N	\N	2025-10-18 07:27:00.651	2025-10-18 07:27:00.651	\N	f	f	180	63	Круги лепестковые ф125мм	GP5016-80		Круг лепестковый 125х22мм P80 плоск. GEPARD (GP5016-80) (плоский КЛТ-1)	null	2.05	\N	IN_REQUEST	\N	\N	2025-10-18 07:27:00.65	\N	0	0	\N	47	\N	MONOLITH	f	\N
187	GP5016-80-20251018-102600132-169626/child-6-1760772420653-xims171m3	46	\N	\N	2025-10-18 07:27:00.654	2025-10-18 07:27:00.654	\N	f	f	180	63	Круги лепестковые ф125мм	GP5016-80		Круг лепестковый 125х22мм P80 плоск. GEPARD (GP5016-80) (плоский КЛТ-1)	null	2.05	\N	IN_REQUEST	\N	\N	2025-10-18 07:27:00.653	\N	0	0	\N	47	\N	MONOLITH	f	\N
176	76617-20251018-094600393-586489/child-2-1760770031996-xzpwfjnu	43	\N	\N	2025-10-18 06:47:11.997	2025-10-18 06:47:25.005	\N	f	f	173	55	Метчики, плашки, воротки	76617		Метчик ручной М6 х 1,0 мм. комплект из 2 шт. Сибртех 76617	null	5.7	\N	ARRIVED	IN_STORE	\N	2025-10-18 06:47:11.996	\N	0	0	\N	44	\N	MONOLITH	f	\N
179	ER-00710M-20251018-095634162-675164	44	\N	\N	2025-10-18 06:56:34.163	2025-10-18 06:56:41.26	\N	f	f	\N	55	Метчики, плашки, воротки	ER-00710M		МЕТЧИК ER-00710M M07X1 (2ШТ),В ПЛАСТИКОВОМ ФУТЛЯРЕ ЭВРИКА /1 NEW	null	\N	\N	CANDIDATE	\N	2025-10-18 06:56:41.259	\N	\N	1	0	\N	45	\N	MONOLITH	f	\N
181	GP5016-80-20251018-102700617-833308	46	\N	\N	2025-10-18 07:27:00.619	2025-10-18 07:27:00.619	\N	f	f	\N	63	Круги лепестковые ф125мм	GP5016-80		Круг лепестковый 125х22мм P80 плоск. GEPARD (GP5016-80) (плоский КЛТ-1)	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	47	\N	MONOLITH	f	\N
180	GP5016-80-20251018-102600132-169626	46	\N	\N	2025-10-18 07:26:00.134	2025-10-18 07:27:00.635	\N	f	f	\N	63	Круги лепестковые ф125мм	GP5016-80		Круг лепестковый 125х22мм P80 плоск. GEPARD (GP5016-80) (плоский КЛТ-1)	null	\N	\N	SPROUTED	\N	2025-10-18 07:26:09.196	\N	\N	1	0	\N	47	\N	MONOLITH	f	\N
188	GP5016-80-20251018-102600132-169626/child-7-1760772420655-fo324kutr	46	\N	\N	2025-10-18 07:27:00.656	2025-10-18 07:27:00.656	\N	f	f	180	63	Круги лепестковые ф125мм	GP5016-80		Круг лепестковый 125х22мм P80 плоск. GEPARD (GP5016-80) (плоский КЛТ-1)	null	2.05	\N	IN_REQUEST	\N	\N	2025-10-18 07:27:00.655	\N	0	0	\N	47	\N	MONOLITH	f	\N
189	GP5016-80-20251018-102600132-169626/child-8-1760772420658-fgh57a0mj	46	\N	\N	2025-10-18 07:27:00.659	2025-10-18 07:27:00.659	\N	f	f	180	63	Круги лепестковые ф125мм	GP5016-80		Круг лепестковый 125х22мм P80 плоск. GEPARD (GP5016-80) (плоский КЛТ-1)	null	2.05	\N	IN_REQUEST	\N	\N	2025-10-18 07:27:00.658	\N	0	0	\N	47	\N	MONOLITH	f	\N
190	GP5016-80-20251018-102600132-169626/child-9-1760772420661-9wd9kftod	46	\N	\N	2025-10-18 07:27:00.662	2025-10-18 07:27:00.662	\N	f	f	180	63	Круги лепестковые ф125мм	GP5016-80		Круг лепестковый 125х22мм P80 плоск. GEPARD (GP5016-80) (плоский КЛТ-1)	null	2.05	\N	IN_REQUEST	\N	\N	2025-10-18 07:27:00.661	\N	0	0	\N	47	\N	MONOLITH	f	\N
191	GP5016-80-20251018-102600132-169626/child-10-1760772420664-pi3kqhsna	46	\N	\N	2025-10-18 07:27:00.665	2025-10-18 07:27:26.648	\N	f	f	180	63	Круги лепестковые ф125мм	GP5016-80		Круг лепестковый 125х22мм P80 плоск. GEPARD (GP5016-80) (плоский КЛТ-1)	null	2.05	\N	ARRIVED	IN_STORE	\N	2025-10-18 07:27:00.664	\N	0	0	\N	47	\N	MONOLITH	f	\N
196	GP5016-80-20251018-102600132-169626/child-15-1760772420678-1kj3ci1us	46	3.5	2025-10-18 07:27:45.568	2025-10-18 07:27:00.679	2025-10-18 07:27:45.569	\N	f	f	180	63	Круги лепестковые ф125мм	GP5016-80		Круг лепестковый 125х22мм P80 плоск. GEPARD (GP5016-80) (плоский КЛТ-1)	null	2.05	\N	ARRIVED	SOLD	\N	2025-10-18 07:27:00.678	\N	0	0	\N	47	\N	MONOLITH	f	\N
195	GP5016-80-20251018-102600132-169626/child-14-1760772420675-2emg31mtu	46	\N	\N	2025-10-18 07:27:00.676	2025-10-18 07:27:14.274	\N	f	f	180	63	Круги лепестковые ф125мм	GP5016-80		Круг лепестковый 125х22мм P80 плоск. GEPARD (GP5016-80) (плоский КЛТ-1)	null	2.05	\N	ARRIVED	IN_STORE	\N	2025-10-18 07:27:00.675	\N	0	0	\N	47	\N	MONOLITH	f	\N
194	GP5016-80-20251018-102600132-169626/child-13-1760772420672-jazyh3io2	46	\N	\N	2025-10-18 07:27:00.673	2025-10-18 07:27:17.454	\N	f	f	180	63	Круги лепестковые ф125мм	GP5016-80		Круг лепестковый 125х22мм P80 плоск. GEPARD (GP5016-80) (плоский КЛТ-1)	null	2.05	\N	ARRIVED	IN_STORE	\N	2025-10-18 07:27:00.672	\N	0	0	\N	47	\N	MONOLITH	f	\N
193	GP5016-80-20251018-102600132-169626/child-12-1760772420670-siok3p9qj	46	\N	\N	2025-10-18 07:27:00.671	2025-10-18 07:27:20.696	\N	f	f	180	63	Круги лепестковые ф125мм	GP5016-80		Круг лепестковый 125х22мм P80 плоск. GEPARD (GP5016-80) (плоский КЛТ-1)	null	2.05	\N	ARRIVED	IN_STORE	\N	2025-10-18 07:27:00.67	\N	0	0	\N	47	\N	MONOLITH	f	\N
192	GP5016-80-20251018-102600132-169626/child-11-1760772420667-mxhlpbhyy	46	\N	\N	2025-10-18 07:27:00.668	2025-10-18 07:27:23.893	\N	f	f	180	63	Круги лепестковые ф125мм	GP5016-80		Круг лепестковый 125х22мм P80 плоск. GEPARD (GP5016-80) (плоский КЛТ-1)	null	2.05	\N	ARRIVED	IN_STORE	\N	2025-10-18 07:27:00.667	\N	0	0	\N	47	\N	MONOLITH	f	\N
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, code, name, description, "categoryId", "createdAt", "updatedAt", "brandId", "spineId") FROM stdin;
1	RF-44836	Головка ударная 36мм (12гр.), 1/2''		3	2025-10-14 09:24:37.981	2025-10-14 09:24:37.981	3	1
2	603010	Головка TORX E10 1/4"		5	2025-10-14 11:15:14.843	2025-10-14 11:15:14.843	4	2
3	514412	Ключ накидной TORX Е10×Е12		7	2025-10-14 11:31:36.953	2025-10-14 11:31:36.953	4	3
4	622030	Головка двенадцатигранная 30мм 1/2"		8	2025-10-14 11:38:11.525	2025-10-14 11:38:28.953	4	4
5	JCB-TH52002C	Подставка ремонтная 2т (h min 278mm, h max 425mm), к-т 2шт		11	2025-10-14 11:44:34.718	2025-10-14 11:44:34.718	5	5
6	JCB-TH52002C-Part	Подставка ремонтная 2т (h min 278mm, h max 425mm)	ОДНА ПОДСТАВКА	11	2025-10-14 11:45:43.758	2025-10-14 11:45:43.758	5	5
7	JCB-TH52002C-Part2	Подставка ремонтная 2т (h min 278mm, h max 425mm)		11	2025-10-14 11:48:26.666	2025-10-14 11:48:26.666	5	5
8	RF-9T0801	Съемник рулевых тяг универсальный 27-42мм, 1/2''		15	2025-10-14 12:01:05.08	2025-10-14 12:01:05.08	3	6
9	PA-44740	Сверло ступенчатое HSS 4241(4-32мм), в блистере		18	2025-10-14 12:07:47.324	2025-10-14 12:07:47.324	6	7
10	RF-75713	Ключ комбинированный трещоточный 13мм		20	2025-10-14 12:12:27.985	2025-10-14 12:12:27.985	3	8
11	RF-1747505 Premium	Бита 6-гранная H5х75ммL,10мм		22	2025-10-14 12:17:07.591	2025-10-14 12:17:07.591	3	9
12	JCB-5457717	Головка глубокая 17мм (6гр.), 1/2''		23	2025-10-15 09:18:49.221	2025-10-15 09:18:49.221	5	10
13	FK-4158	Набор головок Е-профиль,14пр(1/4'':Е4,5,6,7,8, 3/8:Е10,11,12,14, 1/2'':Е16,18,20,22,24),на планке		24	2025-10-15 09:31:05.957	2025-10-15 09:31:05.957	7	11
14	CAEA1612	Переходник 1/2"(F)х3/8(М) TOPTUL	(F) - отверстие\r\n(M) - шток\r\nПереходник TOPTUL 12 F x 38 М (CAEA1612) используется для присоединения головок с квадратом 38 к трещоткам и вороткам с квадратом 12. Рекомендуется для профессионального использования.	27	2025-10-15 09:39:01.196	2025-10-15 09:39:01.196	8	12
15	805382	Ключ шкива коленвала 36×38 мм (112171)		29	2025-10-15 09:47:07.028	2025-10-15 09:47:07.028	4	13
16	825206	Съёмник пистонов обшивки изогнутый 6мм		31	2025-10-15 10:14:00.117	2025-10-15 10:14:00.117	4	14
17	321321	Головка-бита Philips PH.1 1/4'' FORCE 321321		33	2025-10-15 10:42:26.284	2025-10-15 10:42:26.284	1	15
18	322322	Головка-бита Pozidriv PZ.2 1/4'' FORCE 322322		33	2025-10-15 10:46:35.911	2025-10-15 10:46:35.911	1	16
19	274300	Щётка для УШМ проволочная конусная 100мм		35	2025-10-15 10:58:05.009	2025-10-15 10:58:05.009	4	17
20	274325	Щётка для УШМ проволочная конусная 125мм		35	2025-10-15 11:02:19.108	2025-10-15 11:02:19.108	4	17
21	44019	Набор щеток зачистных для дрели 3 шт., 25/50/50 мм АвтоDело 44019 10276		36	2025-10-15 11:16:16.168	2025-10-15 11:16:16.168	9	18
22	800410	Съёмник масляных фильтров ременной Ø60-140 мм		37	2025-10-15 11:22:31.187	2025-10-15 11:22:31.187	4	19
23	F-BSE1-3SM	Быстроразъем пневматический с клапаном-наружняя резьба 3/8''		40	2025-10-15 11:33:22.66	2025-10-15 11:33:22.66	2	20
24	JCB-38841	Набор инструментов 216пр. 1/4'', 3/8'', 1/2''(6гр.)(4-32мм)		42	2025-10-15 12:43:29.733	2025-10-15 12:43:29.733	5	21
25	563592	Набор ключей TORX с отверстием удлинённых 9шт.		43	2025-10-16 08:21:12.195	2025-10-16 08:21:12.195	4	22
26	622019	Головка двенадцатигранная 19мм 1/2"		8	2025-10-16 08:36:34.06	2025-10-16 08:36:34.06	4	23
27	RF-802222	Трещотка реверсивная усиленная изогнутая с резиновой ручкой 1/4''(72зуб.)		44	2025-10-16 08:51:39.588	2025-10-16 08:51:39.588	3	24
28	RF-41082-5L EURO	Набор инструментов 108пр.1/4''&1/2''(6гр.)(4-32мм)		41	2025-10-16 09:04:07.704	2025-10-16 09:04:07.704	3	25
29	BCDA1617	Головка 1/2" с насадкой HEX 17мм TOPTUL		46	2025-10-16 09:11:25.941	2025-10-16 09:11:25.941	8	26
30	1787512	Бита SPLINE M12х75мм,10мм		22	2025-10-16 09:20:15.367	2025-10-16 09:20:15.367	1	9
31	F-61804	Набор щупов 32пр. (0.04-0.88мм), в чехле		49	2025-10-16 09:30:19.393	2025-10-16 09:30:19.393	2	27
32	610 008	Головка шестигранная 8мм 3/8"		50	2025-10-17 06:55:39.302	2025-10-17 06:55:39.302	4	28
33	JGAW0501	Набор экстракторов 5шт TOPTUL		52	2025-10-17 07:04:46.456	2025-10-17 07:04:46.456	8	29
34	270038	Щётка-мини, нейлоновая щетина		54	2025-10-17 07:15:54.355	2025-10-17 07:15:54.355	4	32
35	Sch-TAP10x1,25	Метчик M10x1,25 (3шт)		55	2025-10-17 08:21:53.937	2025-10-17 08:21:53.937	10	36
36	F-9U0102	Съемник внутрених стопорных колец изогнутый 90грд. (глубина-56мм, для суппортов), в блистере		58	2025-10-17 09:39:26.634	2025-10-17 09:39:26.634	2	37
37	816105	Клещи для хомутов ШРУСа		59	2025-10-17 09:49:37.018	2025-10-17 09:49:37.018	4	38
38	RF-1022-34	Вставка для разборки стойки амортизатора (Nissan) 4мм Rock FORCE RF-1022-34		61	2025-10-17 10:09:05.57	2025-10-17 10:09:05.57	3	39
39	PRO-83008	Набор ключей накидн. 6-22мм 8шт PRO STARTUL GT (PRO-83008) (пласт. подвес)		62	2025-10-17 10:14:07.987	2025-10-17 10:14:07.987	11	40
40	F-34012829	Щетка-мини по металлу ручная в пластиковом корпусе с прорезиненной рукояткой (проволока из нержавеющей стали, 3x10рядов)		53	2025-10-18 06:17:54.08	2025-10-18 06:17:54.08	2	41
41	Scheppach	Метчик M8x1,25 (3шт)		55	2025-10-18 06:29:56.705	2025-10-18 06:29:56.705	10	42
42	Метчик M9x1 (3шт)	Метчик M9x1 (3шт)		55	2025-10-18 06:42:10.908	2025-10-18 06:42:10.908	10	43
43	76617	Метчик ручной М6 х 1,0 мм. комплект из 2 шт. Сибртех 76617		55	2025-10-18 06:45:52.101	2025-10-18 06:45:52.101	12	44
44	ER-00710M	МЕТЧИК ER-00710M M07X1 (2ШТ),В ПЛАСТИКОВОМ ФУТЛЯРЕ ЭВРИКА /1 NEW		55	2025-10-18 06:51:57.891	2025-10-18 06:51:57.891	13	45
45	Sch-TAP10x1,5	Метчик M10x1,5 (3шт)	ОСТАТОК ФОРСАЖ 1шт	55	2025-10-18 06:54:13.245	2025-10-18 06:54:13.245	10	46
46	GP5016-80	Круг лепестковый 125х22мм P80 плоск. GEPARD (GP5016-80) (плоский КЛТ-1)		63	2025-10-18 07:25:51.949	2025-10-18 07:25:51.949	14	47
\.


--
-- Data for Name: reorder_points; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reorder_points (id, "productUnitId", "minStock", "maxStock", "reorderQty", "leadTime", "safetyStock", "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: spines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.spines (id, name, slug, "categoryId", "imagePath", "createdAt", "updatedAt", "brandData") FROM stdin;
1	Головка ударная 36мм (12гр.), 1/2''	golovka-udarnaya-36mm-12gr-1-2	3	\N	2025-10-14 09:22:10.795	2025-10-14 09:24:43.256	{"RockFORCE":{"displayName":"Головка ударная 36мм (12гр.), 1/2''","imagePath":"/img/products/RF-44836/RF-44836_1760433877993_1.jpg","productCode":"RF-44836","updatedAt":"2025-10-14T09:24:43.255Z"}}
2	Головка TORX E10 1/4"	golovka-torx-e10-1-4	5	\N	2025-10-14 10:16:36.08	2025-10-14 11:15:45.703	{"Дело техники":{"displayName":"Головка TORX E10 1/4\\"","imagePath":"/img/products/603010/603010_1760440514859_1.jpg","productCode":"603010","updatedAt":"2025-10-14T11:15:45.701Z"}}
3	Ключ накидной Е-профиль Е10хЕ12	klyuch-nakidnoy-e-profil-e10he12	7	\N	2025-10-14 11:30:27.9	2025-10-14 11:32:00.96	{"Дело техники":{"displayName":"Ключ накидной TORX Е10×Е12","imagePath":"/img/products/514412/514412_1760441496965_1.jpg","productCode":"514412","updatedAt":"2025-10-14T11:32:00.959Z"}}
4	Головка 30мм (12гр.), 1/2''	golovka-30mm-12gr-1-2	8	\N	2025-10-14 11:37:11.202	2025-10-14 11:38:45.145	{"Дело техники":{"displayName":"Головка двенадцатигранная 30мм 1/2\\"","imagePath":"/img/products/622030/622030_1760441908955_1.jpg","productCode":"622030","updatedAt":"2025-10-14T11:38:45.144Z"}}
5	Подставка ремонтная 2т	podstavka-remontnaya-2t	11	\N	2025-10-14 11:43:24.821	2025-10-14 11:45:59.704	{"JCB":{"displayName":"Подставка ремонтная 2т (h min 278mm, h max 425mm), к-т 2шт","imagePath":"/img/products/JCB-TH52002C/JCB-TH52002C_1760442274730_1.jpg","productCode":"JCB-TH52002C","updatedAt":"2025-10-14T11:45:59.703Z"}}
6	Съемник рулевых тяг универсальный 27-42мм, 1/2''	s-emnik-rulevyh-tyag-universal-nyy-27-42mm-1-2	15	\N	2025-10-14 11:53:42.745	2025-10-14 12:01:13.757	{"RockFORCE":{"displayName":"Съемник рулевых тяг универсальный 27-42мм, 1/2''","imagePath":"/img/products/RF-9T0801/RF-9T0801_1760443265093_1.jpg","productCode":"RF-9T0801","updatedAt":"2025-10-14T12:01:13.756Z"}}
7	Сверло ступенчатое HSS 4241(4-32мм)	sverlo-stupenchatoe-hss-4241-4-32mm	18	\N	2025-10-14 12:06:25.903	2025-10-14 12:07:53.527	{"Partner":{"displayName":"Сверло ступенчатое HSS 4241(4-32мм), в блистере","imagePath":"/img/products/PA-44740/PA-44740_1760443667328_1.jpg","productCode":"PA-44740","updatedAt":"2025-10-14T12:07:53.526Z"}}
8	Ключ комбинированный трещоточный 13мм	klyuch-kombinirovannyy-treschotochnyy-13mm	20	\N	2025-10-14 12:11:25.113	2025-10-14 12:12:41.367	{"RockFORCE":{"displayName":"Ключ комбинированный трещоточный 13мм","imagePath":"/img/products/RF-75713/RF-75713_1760443947997_1.jpg","productCode":"RF-75713","updatedAt":"2025-10-14T12:12:41.366Z"}}
10	Головка глубокая 17мм (6гр.), 1/2''	golovka-glubokaya-17mm-6gr-1-2	23	\N	2025-10-15 09:17:31.86	2025-10-15 09:19:20.311	{"JCB":{"displayName":"Головка глубокая 17мм (6гр.), 1/2''","imagePath":"/img/products/JCB-5457717/JCB-5457717_1760519929225_1.jpg","productCode":"JCB-5457717","updatedAt":"2025-10-15T09:19:20.309Z"}}
11	Набор головок Е-профиль,14пр(1/4'':Е4,5,6,7,8, 3/8:Е10,11,12,14, 1/2'':Е16,18,20,22,24),на планке	nabor-golovok-e-profil-14pr-1-4-e4-5-6-7-8-3-8-e10-11-12-14-1-2-e16-18-20-22-24-na-planke	24	\N	2025-10-15 09:24:08.868	2025-10-15 09:31:26.598	{"FORCEKRAFT":{"displayName":"Набор головок Е-профиль,14пр(1/4'':Е4,5,6,7,8, 3/8:Е10,11,12,14, 1/2'':Е16,18,20,22,24),на планке","imagePath":"/img/products/FK-4158/FK-4158_1760520666077_1.jpg","productCode":"FK-4158","updatedAt":"2025-10-15T09:31:26.597Z"}}
12	Адаптер-переходник 1/2''(F) x 3/8''(M)	adapter-perehodnik-1-2-f-x-3-8-m	27	\N	2025-10-15 09:35:31.817	2025-10-15 09:39:31.25	{"TOPTUL":{"displayName":"Переходник 1/2\\"(F)х3/8(М) TOPTUL","imagePath":"/img/products/CAEA1612/CAEA1612_1760521141213_1.jpg","productCode":"CAEA1612","updatedAt":"2025-10-15T09:39:31.249Z"}}
13	Ключ шкива коленвала	klyuch-shkiva-kolenvala	29	\N	2025-10-15 09:45:59.127	2025-10-15 09:47:19.243	{"Дело техники":{"displayName":"Ключ шкива коленвала 36×38 мм (112171)","imagePath":"/img/products/805382/805382_1760521627041_1.jpg","productCode":"805382","updatedAt":"2025-10-15T09:47:19.241Z"}}
14	Съёмник пистонов обшивки	s-yomnik-pistonov-obshivki	31	\N	2025-10-15 10:12:50.244	2025-10-15 10:14:11.15	{"Дело техники":{"displayName":"Съёмник пистонов обшивки изогнутый 6мм","imagePath":"/img/products/825206/825206_1760523240121_1.jpg","productCode":"825206","updatedAt":"2025-10-15T10:14:11.149Z"}}
15	Головка-бита Philips PH.1	golovka-bita-philips-ph-1	33	\N	2025-10-15 10:33:43.338	2025-10-15 10:42:31.743	{"Force":{"displayName":"Головка-бита Philips PH.1 1/4'' FORCE 321321","imagePath":"/img/products/321321/321321_1760524946296_1.jpg","productCode":"321321","updatedAt":"2025-10-15T10:42:31.741Z"}}
16	Головка-бита Pozidriv PZ.2 1/4	golovka-bita-pozidriv-pz-2-1-4	33	\N	2025-10-15 10:46:02.829	2025-10-15 10:46:44.415	{"Force":{"displayName":"Головка-бита Pozidriv PZ.2 1/4'' FORCE 322322","imagePath":null,"productCode":"322322","updatedAt":"2025-10-15T10:46:44.414Z"}}
18	Набор щеток на дрель	nabor-schetok-na-drel	36	\N	2025-10-15 11:13:37.766	2025-10-15 11:16:59.096	{"Автодело":{"displayName":"Набор щеток зачистных для дрели 3 шт., 25/50/50 мм АвтоDело 44019 10276","imagePath":"/img/products/44019/44019_1760526976180_1.jpg","productCode":"44019","updatedAt":"2025-10-15T11:16:59.095Z"}}
17	Щётка для УШМ проволочная конусная	schyotka-dlya-ushm-provolochnaya-konusnaya	35	\N	2025-10-15 10:56:12.152	2025-10-15 11:02:50.022	{"Дело техники":{"displayName":"Щётка для УШМ проволочная конусная 125мм","imagePath":null,"productCode":"274325","updatedAt":"2025-10-15T11:02:50.021Z"}}
19	Съёмник масляных фильтров ременной	s-yomnik-maslyanyh-fil-trov-remennoy	37	\N	2025-10-15 11:21:19.259	2025-10-15 11:22:39.011	{"Дело техники":{"displayName":"Съёмник масляных фильтров ременной Ø60-140 мм","imagePath":"/img/products/800410/800410_1760527351198_1.jpg","productCode":"800410","updatedAt":"2025-10-15T11:22:39.010Z"}}
20	Быстроразъем пневматический с клапаном-наружняя резьба 3/8''	bystroraz-em-pnevmaticheskiy-s-klapanom-naruzhnyaya-rez-ba-3-8	40	\N	2025-10-15 11:28:18.278	2025-10-15 11:33:38.484	{"Forsage":{"displayName":"Быстроразъем пневматический с клапаном-наружняя резьба 3/8''","imagePath":"/img/products/F-BSE1-3SM/F-BSE1-3SM_1760528002672_1.jpg","productCode":"F-BSE1-3SM","updatedAt":"2025-10-15T11:33:38.483Z"}}
21	Набор инструментов 216пр. 1/4'', 3/8'', 1/2''(6гр.)(4-32мм)	nabor-instrumentov-216pr-1-4-3-8-1-2-6gr-4-32mm	42	\N	2025-10-15 12:42:43.221	2025-10-15 12:43:43.023	{"JCB":{"displayName":"Набор инструментов 216пр. 1/4'', 3/8'', 1/2''(6гр.)(4-32мм)","imagePath":null,"productCode":"JCB-38841","updatedAt":"2025-10-15T12:43:43.022Z"}}
35	Щётка-мини с прорезиненной рукояткой, щетина из нержавеющей стали	schyotka-mini-s-prorezinennoy-rukoyatkoy-schetina-iz-nerzhaveyuschey-stali	54	\N	2025-10-17 07:14:36.593	2025-10-17 07:14:36.593	\N
22	Набор ключей Г-образных TORX 9пр.	nabor-klyuchey-g-obraznyh-torx-9pr	43	\N	2025-10-16 08:11:26.039	2025-10-16 08:27:24.167	{"Дело техники":{"displayName":"Набор ключей TORX с отверстием удлинённых 9шт.","imagePath":"/img/products/563592/563592_1760602872238_1.jpg","productCode":"563592","updatedAt":"2025-10-16T08:27:24.166Z"}}
23	Головка двенадцатигранная 19мм 1/2"	golovka-dvenadtsatigrannaya-19mm-1-2	8	\N	2025-10-16 08:35:28.485	2025-10-16 08:45:35.597	{"Дело техники":{"displayName":"Головка двенадцатигранная 19мм 1/2\\"","imagePath":null,"productCode":"622019","updatedAt":"2025-10-16T08:45:35.596Z"}}
24	Трещотка реверсивная усиленная изогнутая с резиновой ручкой 1/4''(72зуб.)	treschotka-reversivnaya-usilennaya-izognutaya-s-rezinovoy-ruchkoy-1-4-72zub	44	\N	2025-10-16 08:50:34.03	2025-10-16 08:54:19.677	{"RockFORCE":{"displayName":"Трещотка реверсивная усиленная изогнутая с резиновой ручкой 1/4''(72зуб.)","imagePath":"/img/products/RF-802222/RF-802222_1760604699615_1.jpg","productCode":"RF-802222","updatedAt":"2025-10-16T08:54:19.673Z"}}
25	Набор инструментов 108пр.1/4''&1/2''(6гр.)(4-32мм)	nabor-instrumentov-108pr-1-4-1-2-6gr-4-32mm	41	\N	2025-10-16 09:01:59.768	2025-10-16 09:04:21.513	{"RockFORCE":{"displayName":"Набор инструментов 108пр.1/4''&1/2''(6гр.)(4-32мм)","imagePath":"/img/products/RF-41082-5L EURO/RF-41082-5L EURO_1760605447717_1.jpg","productCode":"RF-41082-5L EURO","updatedAt":"2025-10-16T09:04:21.512Z"}}
26	Головка бита 6-гранная Н17 (L-45мм)1/2''	golovka-bita-6-grannaya-n17-l-45mm-1-2	46	\N	2025-10-16 09:09:40.133	2025-10-16 09:11:40.107	{"TOPTUL":{"displayName":"Головка 1/2\\" с насадкой HEX 17мм TOPTUL","imagePath":"/img/products/BCDA1617/BCDA1617_1760605885954_1.jpg","productCode":"BCDA1617","updatedAt":"2025-10-16T09:11:40.105Z"}}
9	Бита торкс 12-лучевой 75мм М10	bita-12-grannaya-m12-75mml-10mm	22	\N	2025-10-14 12:15:49.721	2025-10-16 09:20:20.81	{"RockFORCE":{"displayName":"Бита 6-гранная H5х75ммL,10мм","imagePath":"/img/products/RF-1747505 Premium/RF-1747505 Premium_1760444227594_1.jpg","productCode":"RF-1747505 Premium","updatedAt":"2025-10-14T12:17:13.435Z"},"Force":{"displayName":"Бита SPLINE M12х75мм,10мм","imagePath":"/img/products/1787512/1787512_1760606415380_1.jpg","productCode":"1787512","updatedAt":"2025-10-16T09:20:20.808Z"}}
27	Набор щупов 32пр. (0.04-0.88мм), в чехле	nabor-schupov-32pr-0-04-0-88mm-v-chehle	49	\N	2025-10-16 09:27:47.322	2025-10-16 09:30:49.05	{"Forsage":{"displayName":"Набор щупов 32пр. (0.04-0.88мм), в чехле","imagePath":"/img/products/F-61804/F-61804_1760607019404_1.jpg","productCode":"F-61804","updatedAt":"2025-10-16T09:30:49.049Z"}}
28	Головка 8мм (6гр.), 3/8''	golovka-8mm-6gr-3-8	50	\N	2025-10-17 06:53:44.5	2025-10-17 06:57:55.053	{"Дело техники":{"displayName":"Головка шестигранная 8мм 3/8\\"","imagePath":"/img/products/610 008/610 008_1760684139309_1.jpg","productCode":"610 008","updatedAt":"2025-10-17T06:57:55.051Z"}}
29	Набор экстракторов Toptul	nabor-ekstraktorov-toptul	52	\N	2025-10-17 07:03:09.905	2025-10-17 07:04:55.174	{"TOPTUL":{"displayName":"Набор экстракторов 5шт TOPTUL","imagePath":"/img/products/JGAW0501/JGAW0501_1760684686475_1.jpg","productCode":"JGAW0501","updatedAt":"2025-10-17T07:04:55.172Z"}}
30	Щётка-мини, латунная щетина	schyotka-mini-latunnaya-schetina	54	\N	2025-10-17 07:12:07.89	2025-10-17 07:12:07.89	\N
31	Щётка-мини, щетина из нержавеющей стали	schyotka-mini-schetina-iz-nerzhaveyuschey-stali	54	\N	2025-10-17 07:12:46.808	2025-10-17 07:12:46.808	\N
33	Набор щёток-мини, (латунная, нержавеющая сталь, нейлоновая), 3 штуки	nabor-schyotok-mini-latunnaya-nerzhaveyuschaya-stal-neylonovaya-3-shtuki	54	\N	2025-10-17 07:13:40.007	2025-10-17 07:13:40.007	\N
34	Щётка-мини с прорезиненной рукояткой, латунная щетина	schyotka-mini-s-prorezinennoy-rukoyatkoy-latunnaya-schetina	54	\N	2025-10-17 07:14:07.507	2025-10-17 07:14:07.507	\N
32	Щётка-мини, нейлоновая щетина	schyotka-mini-neylonovaya-schetina	54	\N	2025-10-17 07:13:14.097	2025-10-17 07:16:01.658	{"Дело техники":{"displayName":"Щётка-мини, нейлоновая щетина","imagePath":"/img/products/270038/270038_1760685354358_1.jpg","productCode":"270038","updatedAt":"2025-10-17T07:16:01.657Z"}}
36	Метчик M10x1,25 (3шт)	metchik-m10x1-25-3sht	55	\N	2025-10-17 08:19:32.325	2025-10-17 08:22:01.263	{"Scheppach":{"displayName":"Метчик M10x1,25 (3шт)","imagePath":"/img/products/Sch-TAP10x1,25/Sch-TAP10x1,25_1760689313948_1.jpg","productCode":"Sch-TAP10x1,25","updatedAt":"2025-10-17T08:22:01.262Z"}}
37	Съемник внутрених стопорных колец изогнутый 90грд. (глубина-56мм, для суппортов), в блистере	s-emnik-vnutrenih-stopornyh-kolets-izognutyy-90grd-glubina-56mm-dlya-supportov-v-blistere	58	\N	2025-10-17 09:38:02.907	2025-10-17 09:41:05.087	{"Forsage":{"displayName":"Съемник внутрених стопорных колец изогнутый 90грд. (глубина-56мм, для суппортов), в блистере","imagePath":"/img/products/F-9U0102/F-9U0102_1760693966646_1.jpg","productCode":"F-9U0102","updatedAt":"2025-10-17T09:41:05.086Z"}}
38	Клещи для хомутов ШРУСа	kleschi-dlya-homutov-shrusa	59	\N	2025-10-17 09:48:30.286	2025-10-17 09:49:50.36	{"Дело техники":{"displayName":"Клещи для хомутов ШРУСа","imagePath":"/img/products/816105/816105_1760694577021_1.jpg","productCode":"816105","updatedAt":"2025-10-17T09:49:50.359Z"}}
39	Вставка для разборки стойки амортизатора (Nissan) 4мм Rock FORCE RF-1022-34	vstavka-dlya-razborki-stoyki-amortizatora-nissan-4mm-rock-force-rf-1022-34	61	\N	2025-10-17 10:08:20.117	2025-10-17 10:09:11.473	{"RockFORCE":{"displayName":"Вставка для разборки стойки амортизатора (Nissan) 4мм Rock FORCE RF-1022-34","imagePath":"/img/products/RF-1022-34/RF-1022-34_1760695745583_1.jpg","productCode":"RF-1022-34","updatedAt":"2025-10-17T10:09:11.472Z"}}
40	Набор ключей накидн. 6-22мм 8шт PRO STARTUL GT (PRO-83008) (пласт. подвес)	nabor-klyuchey-nakidn-6-22mm-8sht-pro-startul-gt-pro-83008-plast-podves	62	\N	2025-10-17 10:12:59.782	2025-10-17 10:14:16.351	{"STARTUL":{"displayName":"Набор ключей накидн. 6-22мм 8шт PRO STARTUL GT (PRO-83008) (пласт. подвес)","imagePath":"/img/products/PRO-83008/PRO-83008_1760696047999_1.jpg","productCode":"PRO-83008","updatedAt":"2025-10-17T10:14:16.350Z"}}
41	Щетка-мини по металлу ручная в пластиковом корпусе с прорезиненной рукояткой (проволока из нержавеющей стали, 3x10рядов)	schetka-mini-po-metallu-ruchnaya-v-plastikovom-korpuse-s-prorezinennoy-rukoyatkoy-provoloka-iz-nerzhaveyuschey-stali-3x10ryadov	53	\N	2025-10-18 06:16:46.391	2025-10-18 06:18:21.328	{"Forsage":{"displayName":"Щетка-мини по металлу ручная в пластиковом корпусе с прорезиненной рукояткой (проволока из нержавеющей стали, 3x10рядов)","imagePath":"/img/products/F-34012829/F-34012829_1760768274085_1.jpg","productCode":"F-34012829","updatedAt":"2025-10-18T06:18:21.326Z"}}
42	Метчик M8x1,25 (3шт)	metchik-m8x1-25-3sht	55	\N	2025-10-18 06:28:43.433	2025-10-18 06:30:03.065	{"Scheppach":{"displayName":"Метчик M8x1,25 (3шт)","imagePath":null,"productCode":"Scheppach","updatedAt":"2025-10-18T06:30:03.063Z"}}
43	Метчик M9x1 (3шт)	metchik-m9x1-3sht	55	\N	2025-10-18 06:41:26.547	2025-10-18 06:42:21.648	{"Scheppach":{"displayName":"Метчик M9x1 (3шт)","imagePath":null,"productCode":"Метчик M9x1 (3шт)","updatedAt":"2025-10-18T06:42:21.646Z"}}
44	Метчик ручной М6 х 1,0 мм	metchik-ruchnoy-m6-h-1-0-mm	55	\N	2025-10-18 06:45:29.107	2025-10-18 06:46:00.422	{"СибрТех":{"displayName":"Метчик ручной М6 х 1,0 мм. комплект из 2 шт. Сибртех 76617","imagePath":null,"productCode":"76617","updatedAt":"2025-10-18T06:46:00.421Z"}}
46	Sch-TAP10x1,5	sch-tap10x1-5	55	\N	2025-10-18 06:53:06.131	2025-10-18 06:54:23.94	{"Scheppach":{"displayName":"Метчик M10x1,5 (3шт)","imagePath":null,"productCode":"Sch-TAP10x1,5","updatedAt":"2025-10-18T06:54:23.939Z"}}
45	Метчик m7x1	metchik-m7x1	55	\N	2025-10-18 06:51:08.952	2025-10-18 06:56:34.191	{"Эврика":{"displayName":"МЕТЧИК ER-00710M M07X1 (2ШТ),В ПЛАСТИКОВОМ ФУТЛЯРЕ ЭВРИКА /1 NEW","imagePath":null,"productCode":"ER-00710M","updatedAt":"2025-10-18T06:56:34.190Z"}}
47	Круг лепестковый 125х22мм	krug-lepestkovyy-125h22mm	63	\N	2025-10-18 07:24:43.085	2025-10-18 07:26:00.156	{"GEPARD":{"displayName":"Круг лепестковый 125х22мм P80 плоск. GEPARD (GP5016-80) (плоский КЛТ-1)","imagePath":null,"productCode":"GP5016-80","updatedAt":"2025-10-18T07:26:00.155Z"}}
\.


--
-- Data for Name: suppliers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.suppliers (id, name) FROM stdin;
\.


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 1, false);


--
-- Name: brands_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.brands_id_seq', 14, true);


--
-- Name: cash_days_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cash_days_id_seq', 5, true);


--
-- Name: cash_events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cash_events_id_seq', 35, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 63, true);


--
-- Name: customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customers_id_seq', 1, false);


--
-- Name: disassembly_scenarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.disassembly_scenarios_id_seq', 1, true);


--
-- Name: inventory_forecasts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventory_forecasts_id_seq', 1, false);


--
-- Name: inventory_snapshots_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventory_snapshots_id_seq', 346, true);


--
-- Name: product_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_images_id_seq', 36, true);


--
-- Name: product_sales_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_sales_history_id_seq', 1, false);


--
-- Name: product_unit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_unit_logs_id_seq', 623, true);


--
-- Name: product_units_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_units_id_seq', 196, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 46, true);


--
-- Name: reorder_points_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reorder_points_id_seq', 1, false);


--
-- Name: spines_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.spines_id_seq', 47, true);


--
-- Name: suppliers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.suppliers_id_seq', 1, false);


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
-- Name: reorder_points_productUnitId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "reorder_points_productUnitId_key" ON public.reorder_points USING btree ("productUnitId");


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

