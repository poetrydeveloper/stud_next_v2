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
-- Name: product_images id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images ALTER COLUMN id SET DEFAULT nextval('public.product_images_id_seq'::regclass);


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
e323afa8-d91c-4410-93f1-cc6a572ab2f8	6097743f8f826ee9c930d428445ca4871ba277989671ce520d018d9440ac1cbf	2025-10-11 13:47:34.090044+03	20250821120718_init	\N	\N	2025-10-11 13:47:34.081202+03	1
96140eb0-42d9-436c-ada4-32010ba80ea0	830b83a2022bfab0b77d71fe69ce4ec6a808c8d8325d9e5d7622d44e354027c2	2025-10-11 13:47:34.223838+03	20251005102252_add_brand_data_to_spine	\N	\N	2025-10-11 13:47:34.21837+03	1
4efcc8d3-aaf0-4834-97b6-755fd6ddee21	a3c0b3d748399cbd945ab90c4b7d0b62dd3277636b6f41e87cf2ec16439e5f22	2025-10-11 13:47:34.11211+03	20250822101836_add_products	\N	\N	2025-10-11 13:47:34.090293+03	1
4c6b5102-7df4-461b-9be7-a25f350c67e0	2a036f61a9dffbb5eac2939f47e527dfa47bee8f57a95597890d2a50a7177975	2025-10-11 13:47:34.126614+03	20250828083337_add_requests	\N	\N	2025-10-11 13:47:34.112383+03	1
fc6d34be-6848-47f0-b2fc-b1092e72eda9	7f43e3217dfed2f0a559c35e1da19e16d7b816d98a02e70d482b7e9dd92103d0	2025-10-11 13:47:34.128296+03	20250828090249_add_requestitem_status_nullable_request	\N	\N	2025-10-11 13:47:34.126865+03	1
4c7d8eb2-2ed2-4d18-ad9d-6e540bbae842	93079e08ffc8acad47679411ed6afc1ecd297c91e17ec89a703cc3c7e01264bc	2025-10-11 13:47:34.224886+03	20251008080927_add_storage_fields_to_product_image	\N	\N	2025-10-11 13:47:34.224076+03	1
ea508462-f12e-46db-b162-0f31d409504d	745a1cf4d376e55517ac77da7b1f71104dea18edeca26c34c5b18c693abbf29c	2025-10-11 13:47:34.141582+03	20250830104144_add_supplier_customer_relations	\N	\N	2025-10-11 13:47:34.128535+03	1
48b42aef-9fa8-48bf-8c2e-8b2d9b3db49f	3661860701ab38df7a9a21c352f2c9aaa1bebf581f77249ba1b99fe27abf8a13	2025-10-11 13:47:34.150424+03	20250909092344_delivery	\N	\N	2025-10-11 13:47:34.141831+03	1
8b1c0077-6d3e-40e1-b480-174b3744d727	3f1bb07f5d39d038616ae31ba8c5344d306093ccaacc182ac85767d27b025fdc	2025-10-11 13:47:34.159513+03	20250911110306_add_product_units_relations	\N	\N	2025-10-11 13:47:34.150676+03	1
dded0b10-6cd8-4df3-9271-6d6b74692daf	45aed8cf7173aebe70d2bd9ffe5cd34c608b5c4ca0ce0a45e82788c60a9fe5d3	2025-10-11 13:47:34.23449+03	20251009111713_add_disassembly_feature	\N	\N	2025-10-11 13:47:34.225112+03	1
09d0c4a5-b30d-41e2-9e9d-9ff928a5335c	2486f73ce327ecb2df7d500043070794a426f9b7fa0fac76d87afe4414868a33	2025-10-11 13:47:34.182027+03	20250914115946_add_cash_system	\N	\N	2025-10-11 13:47:34.159762+03	1
08c0ae6f-1e80-4235-90e6-026641ece2b4	929d175f3ac445b512440357cfef2e3fafcc26209efb521722707b6ba3cce2bc	2025-10-11 13:47:34.185092+03	20250923114109_add_cash_event_relation	\N	\N	2025-10-11 13:47:34.182291+03	1
21f8cd3b-212b-4084-93d3-fb8319c5b0e0	fef88826f0249f26384222f77fd8c9e75771ddab70b8f2e760a5adf430267bc8	2025-10-11 13:47:34.202117+03	20250925093430_init	\N	\N	2025-10-11 13:47:34.185338+03	1
7b26311b-5569-4699-ac98-a8d3f9b29def	36b08c37c7bc7054303c2f065dcbdbbd196fbb888fc25bc618aa9f1c6d497620	2025-10-11 13:47:34.23823+03	20251010105616_fix_disassembly_relations	\N	\N	2025-10-11 13:47:34.234715+03	1
1e9c0898-7a4f-4068-bd09-365e21d1c331	7c2937d04ac32b2f117f9bbdff39c3b039ce195de78d58d25eee8c1693f5ef14	2025-10-11 13:47:34.203278+03	20250925110251_add_productunit_fields	\N	\N	2025-10-11 13:47:34.202396+03	1
8b68d36f-474d-4e52-b1ae-1c366e2adab1	6097743f8f826ee9c930d428445ca4871ba277989671ce520d018d9440ac1cbf	2025-10-12 22:45:35.438528+03	20250821120718_init	\N	\N	2025-10-12 22:45:35.427641+03	1
b57b5304-3987-4945-bcb1-6f3001f22d8f	d5d7a96fd29eb28da5b0bb0a2596916574a93690a7729f96b500872d7107652e	2025-10-11 13:47:34.2118+03	20250926073852_add_spine_entity	\N	\N	2025-10-11 13:47:34.203539+03	1
db21a2ff-bf21-4b42-a791-299de67ee703	44334d5f147b873799966a3a4c3a60ae16f4642dbe3051542ad5ba0c496f69b4	2025-10-12 22:45:35.563171+03	20251005102252_add_brand_data_to_spine	\N	\N	2025-10-12 22:45:35.560155+03	1
99b95c26-857b-4158-bc35-ebb320471b4a	926488ecf53afc18868502f07faaac112ef39553a081e3c894c4374275751d8d	2025-10-11 13:47:34.218134+03	20250930104749_add_product_unit_logs	\N	\N	2025-10-11 13:47:34.212045+03	1
1678906f-9bf1-4fb8-b163-f271ebfe4c40	a3c0b3d748399cbd945ab90c4b7d0b62dd3277636b6f41e87cf2ec16439e5f22	2025-10-12 22:45:35.465747+03	20250822101836_add_products	\N	\N	2025-10-12 22:45:35.439079+03	1
cdbb23ca-5cba-48c2-99a5-096e87d12883	2a036f61a9dffbb5eac2939f47e527dfa47bee8f57a95597890d2a50a7177975	2025-10-12 22:45:35.483982+03	20250828083337_add_requests	\N	\N	2025-10-12 22:45:35.467126+03	1
150ed341-16c4-426c-98c5-92b3bd43009f	7f43e3217dfed2f0a559c35e1da19e16d7b816d98a02e70d482b7e9dd92103d0	2025-10-12 22:45:35.487466+03	20250828090249_add_requestitem_status_nullable_request	\N	\N	2025-10-12 22:45:35.484551+03	1
5b27e7c8-f5be-48be-81b6-7da24f0e1ca0	24bdb8206665439383f9f6aa150099ac964a315705acb3445597c0a79c0da539	2025-10-12 22:45:35.564829+03	20251008080927_add_storage_fields_to_product_image	\N	\N	2025-10-12 22:45:35.563495+03	1
582e474a-fc91-42ee-839e-abaeac3652ac	745a1cf4d376e55517ac77da7b1f71104dea18edeca26c34c5b18c693abbf29c	2025-10-12 22:45:35.5055+03	20250830104144_add_supplier_customer_relations	\N	\N	2025-10-12 22:45:35.488077+03	1
bf8fbe18-f137-4534-820a-3fb7f34ea08d	a3daecbe80eafe9cd640334c371673cf2656a1ff2f0da969ec9254b28430cd9f	2025-10-12 22:45:35.515257+03	20250909092344_delivery	\N	\N	2025-10-12 22:45:35.506042+03	1
a659d2ae-9116-41c2-83f7-5b9bd5d6a6f9	f1667b9846849fff9b81db03f415362255ecc60e266d9d17eecf668fb0b97a1c	2025-10-12 22:45:35.522648+03	20250911110306_add_product_units_relations	\N	\N	2025-10-12 22:45:35.516101+03	1
c87b2b74-411a-4ea3-a5d0-ccd6511422d1	976bcf0b774d3b5b5c6f2b936ab5276ce377c22fbb619248d946085ed8bc85ac	2025-10-12 22:45:35.57109+03	20251009111713_add_disassembly_feature	\N	\N	2025-10-12 22:45:35.565127+03	1
0aa0b6fe-15f1-4f6a-9c1f-58c22861e990	5984d33527fb4d6d25fa428fc923aef47de57848a7680ebad02c34443617af1a	2025-10-12 22:45:35.534369+03	20250914115946_add_cash_system	\N	\N	2025-10-12 22:45:35.52292+03	1
52b241e2-ae69-419d-b6de-707434ac0f24	ab92b7b4fc02e31c966eb076324f1af13faccf362c5b1d7ae74d3b2763cdd6b9	2025-10-12 22:45:35.537774+03	20250923114109_add_cash_event_relation	\N	\N	2025-10-12 22:45:35.534667+03	1
fae51a95-36b4-44a2-aa6c-f41eebbaa070	8ee17ad1ab36533275c785a2a5b8c455e31d69dfd54d0e28d937384a230b7df1	2025-10-12 22:45:35.549261+03	20250925093430_init	\N	\N	2025-10-12 22:45:35.53799+03	1
d3e13cfb-6b2b-4d39-adee-93300ee5ef85	bb96e01bddaff8038b65f4ac87980ef3fc16032a94f6fa276e5abed4ac9c329d	2025-10-12 22:45:35.574087+03	20251010105616_fix_disassembly_relations	\N	\N	2025-10-12 22:45:35.57131+03	1
c70dfb97-b9d5-4ab9-8169-063f9995ee12	91366dd8358f057d1b5d8ebf866055be3b6f6b9cfff556e365bed43cf77a6d1e	2025-10-12 22:45:35.550265+03	20250925110251_add_productunit_fields	\N	\N	2025-10-12 22:45:35.549527+03	1
3a9c0bbb-9d49-4b08-aeda-d2ece3a5e3c1	b9586b45cf17922689d38e947d36e009e886f2a8f078053e2f25cf95ed31b724	2025-10-12 22:45:35.556054+03	20250926073852_add_spine_entity	\N	\N	2025-10-12 22:45:35.550532+03	1
500891d2-0509-4def-934a-eef210213cb3	7e52e1dd5f7801459ab5ccefdb186139920e153dd53377ce73e41264c5ec8544	2025-10-12 22:45:35.559885+03	20250930104749_add_product_unit_logs	\N	\N	2025-10-12 22:45:35.556313+03	1
\.


--
-- Data for Name: brands; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.brands (id, name, slug, "createdAt", "updatedAt") FROM stdin;
1	GEPARD	gepard	2025-10-11 11:48:43.58	2025-10-11 11:48:43.58
3	FORCEKRAFT	forcekraft	2025-10-12 11:26:09.141	2025-10-12 11:26:09.141
4	Vertul	vertul	2025-10-12 11:40:19.254	2025-10-12 11:40:19.254
5	LUGAABRASIV	lugaabrasiv	2025-10-12 11:49:55.469	2025-10-12 11:49:55.469
6	RockFORCE	rockforce	2025-10-12 12:00:57.55	2025-10-12 12:00:57.55
7	Forsage	forsage	2025-10-12 12:09:28.071	2025-10-12 12:09:28.071
8	SOLARIS	solaris	2025-10-12 12:18:18.423	2025-10-12 12:18:18.423
9	Partner	partner	2025-10-12 12:26:18.813	2025-10-12 12:26:18.813
10	Airline	airline	2025-10-12 12:38:40.727	2025-10-12 12:38:40.727
11	JCB	jcb	2025-10-12 12:58:12.472	2025-10-12 12:58:12.472
\.


--
-- Data for Name: cash_days; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cash_days (id, date, is_closed, total, created_at, updated_at) FROM stdin;
2	2025-10-13 21:00:00	f	0	2025-10-14 08:02:46.185	2025-10-14 08:02:46.185
1	2025-10-11 21:00:00	t	167.7	2025-10-12 11:33:12.049	2025-10-14 11:32:37.976
\.


--
-- Data for Name: cash_events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cash_events (id, type, amount, notes, cash_day_id, product_unit_id, created_at) FROM stdin;
1	SALE	25	Продажа: Болт к набору для замены сайлентблоков М10	1	1	2025-10-12 11:38:18.35
2	SALE	25	Продажа: Приспособление для центровки дисков сцепления Vertul VR50840	1	3	2025-10-12 11:48:12.657
3	SALE	1	Продажа: Круг отрезной 125х0.8x22.2 мм для металла LUGAABRASIV	1	31	2025-10-12 11:54:32.825
6	SALE	1	Продажа: Круг отрезной 125х0.8x22.2 мм для металла LUGAABRASIV	1	28	2025-10-12 11:55:06.954
7	SALE	1	Продажа: Круг отрезной 125х0.8x22.2 мм для металла LUGAABRASIV	1	27	2025-10-12 11:55:23.243
8	SALE	1	Продажа: Круг отрезной 125х0.8x22.2 мм для металла LUGAABRASIV	1	26	2025-10-12 11:55:35.767
9	SALE	12	Продажа: Трещотка реверсивная усиленная изогнутая с резиновой ручкой 1/4''(72зуб.)	1	36	2025-10-12 12:08:13.914
10	SALE	10	Продажа: Ключ комбинированный 25мм	1	37	2025-10-12 12:15:36.722
11	SALE	47	Продажа: Проволока сварочная омедненная ER 70S-6 ф0,8мм (катушка D200 5 кг) SOLARIS (аналог СВ08Г2С)	1	39	2025-10-12 12:24:24.597
12	SALE	8.7	Продажа: Съемник стопорных колец изогнутый на разжим (90°,L-175мм), в блистере	1	44	2025-10-12 12:33:40.548
13	SALE	14	Продажа: Съемник стопорных колец изогнутый на разжим (90°,L-175мм), в блистере	1	43	2025-10-12 12:33:52.675
14	SALE	20	Продажа: Зажим с фиксацией 225мм	1	48	2025-10-12 12:54:55.284
4	SALE	1	Продажа: Круг отрезной 125х0.8x22.2 мм для металла LUGAABRASIV	1	30	2025-10-12 11:54:49.451
5	SALE	1	Продажа: Круг отрезной 125х0.8x22.2 мм для металла LUGAABRASIV	1	29	2025-10-12 11:54:56.827
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, slug, path) FROM stdin;
1	Оснастка	osnastka	/1/
2	Оснастка к электроинструменту	osnastka-k-elektroinstrumentu	/1/2/
3	Оснастка для угловых шлифмашин	osnastka-dlya-uglovyh-shlifmashin	/1/2/3/
4	Круги лепестковые	krugi-lepestkovye	/1/2/3/4/
5	Специальный инструмент	spetsial-nyy-instrument	/5/
6	Ходовая часть	hodovaya-chast	/5/6/
7	Сайлентблоки	saylentbloki	/5/6/7/
8	Болты к набору для замены сайлентблоков	bolty-k-naboru-dlya-zameny-saylentblokov	/5/6/7/8/
9	Трансмиссия	transmissiya	/5/9/
10	Приспособление для центровки дисков сцепления	prisposoblenie-dlya-tsentrovki-diskov-stsepleniya	/5/9/10/
11	Круги отрезные и обдирочные ф 125 мм	krugi-otreznye-i-obdirochnye-f-125-mm	/1/2/3/11/
12	Ручной инструмент	ruchnoy-instrument	/12/
13	Воротки, удлинители, трещотки	vorotki-udliniteli-treschotki	/12/13/
14	1/4" Трещотки	1-4-treschotki	/12/13/14/
15	Ключи	klyuchi	/12/15/
16	Комбинированные	kombinirovannye	/12/15/16/
17	Сварочное оборудование и материалы	svarochnoe-oborudovanie-i-materialy	/17/
18	Проволока сварочная для сварки углеродистых и низколегированных сталей	provoloka-svarochnaya-dlya-svarki-uglerodistyh-i-nizkolegirovannyh-staley	/17/18/
19	Проволока сварочная ф0,8мм	provoloka-svarochnaya-f0-8mm	/17/18/19/
20	Шарнирно-губцевый	sharnirno-gubtsevyy	/12/20/
21	Стопорные кольца	stopornye-kol-tsa	/12/20/21/
22	Съемник стопорных колец изогнутый на разжим (90°,L-175мм), в блистере	s-emnik-stopornyh-kolets-izognutyy-na-razzhim-90-l-175mm-v-blistere	/12/20/21/22/
23	Зажимы с фиксатором	zazhimy-s-fiksatorom	/12/20/23/
24	Наборы инструментов	nabory-instrumentov	/12/24/
25	1/4" и 1/2"	1-4-i-1-2	/12/24/25/
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
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_images (id, "productId", filename, path, "isMain", "createdAt", "githubUrl", "localPath", "storageType") FROM stdin;
1	1	GP5016-40_1760268195564_1.jpg	/img/products/GP5016-40/GP5016-40_1760268195564_1.jpg	t	2025-10-12 11:23:15.566	\N	\N	local
2	2	FK-933T1-10P_1760268613489_1.jpg	/img/products/FK-933T1-10P/FK-933T1-10P_1760268613489_1.jpg	t	2025-10-12 11:30:13.49	\N	\N	local
3	3	VR50840_1760269505216_1.jpg	/img/products/VR50840/VR50840_1760269505216_1.jpg	t	2025-10-12 11:45:05.218	\N	\N	local
4	4	4603347328026_1760269956262_1.jpg	/img/products/4603347328026/4603347328026_1760269956262_1.jpg	t	2025-10-12 11:52:36.263	\N	\N	local
5	5	RF-802222_1760270695222_1.jpg	/img/products/RF-802222/RF-802222_1760270695222_1.jpg	t	2025-10-12 12:04:55.223	\N	\N	local
6	6	F-75525_1760271208817_1.jpg	/img/products/F-75525/F-75525_1760271208817_1.jpg	t	2025-10-12 12:13:28.819	\N	\N	local
7	7	WM-ER70S6-08050_1760271686213_1.jpg	/img/products/WM-ER70S6-08050/WM-ER70S6-08050_1760271686213_1.jpg	t	2025-10-12 12:21:26.215	\N	\N	local
8	8	PA-68-175SB_1760272293897_1.jpg	/img/products/PA-68-175SB/PA-68-175SB_1760272293897_1.jpg	t	2025-10-12 12:31:33.898	\N	\N	local
9	9	AT-JLP-10_1760272939101_1.jpg	/img/products/AT-JLP-10/AT-JLP-10_1760272939101_1.jpg	t	2025-10-12 12:42:19.102	\N	\N	local
\.


--
-- Data for Name: product_unit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_unit_logs (id, "productUnitId", type, message, meta, "createdAt") FROM stdin;
1	1	SYSTEM	Unit автоматически создан из продукта Болт к набору для замены сайлентблоков М10	\N	2025-10-12 11:30:27.143
2	1	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-12 11:30:48.763
3	2	SYSTEM	CLEAR unit создан как замена для кандидата #FK-933T1-10P-20251012-143027141-703663	{"purpose": "replacement_for_candidate", "sourceUnitId": 1, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "FK-933T1-10P-20251012-143027141-703663"}	2025-10-12 11:31:36.472
4	1	IN_REQUEST	Создана одиночная заявка, цена: 18	{"pricePerUnit": 18, "clearReplacementUnitId": 2}	2025-10-12 11:31:36.479
5	1	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-12 11:32:27.299
6	1	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-12 11:32:27.302
7	1	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-12 11:32:27.304
8	1	SALE	Товар продан за 25 ₽	{"isCredit": false, "buyerName": "", "salePrice": 25, "buyerPhone": ""}	2025-10-12 11:38:18.331
9	2	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-12 11:39:11.963
10	3	SYSTEM	Unit автоматически создан из продукта Приспособление для центровки дисков сцепления Vertul VR50840	\N	2025-10-12 11:45:19.827
11	3	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-12 11:45:32.16
12	4	SYSTEM	CLEAR unit создан как замена для кандидата #VR50840-20251012-144519826-798270	{"purpose": "replacement_for_candidate", "sourceUnitId": 3, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "VR50840-20251012-144519826-798270"}	2025-10-12 11:46:55.709
13	3	IN_REQUEST	Создана одиночная заявка, цена: 22	{"pricePerUnit": 22, "clearReplacementUnitId": 4}	2025-10-12 11:46:55.722
14	3	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-12 11:47:13.438
15	3	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-12 11:47:13.44
16	3	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-12 11:47:13.442
17	3	SALE	Товар продан за 25 ₽	{"isCredit": false, "buyerName": "", "salePrice": 25, "buyerPhone": ""}	2025-10-12 11:48:12.652
18	5	SYSTEM	Unit автоматически создан из продукта Круг отрезной 125х0.8x22.2 мм для металла LUGAABRASIV	\N	2025-10-12 11:52:45.71
19	5	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-12 11:52:56.222
20	6	SYSTEM	CLEAR unit создан как замена для кандидата #4603347328026-20251012-145245709-522301	{"purpose": "replacement_for_candidate", "sourceUnitId": 5, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "4603347328026-20251012-145245709-522301"}	2025-10-12 11:53:29.438
21	5	SPROUTED	Unit преобразован в SPROUTED для создания 25 дочерних заявок	{"pricePerUnit": 0.66, "childrenCount": 25}	2025-10-12 11:53:29.452
22	7	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 25, "sequence": 1, "parentUnitId": 5}	2025-10-12 11:53:29.454
23	8	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 25, "sequence": 2, "parentUnitId": 5}	2025-10-12 11:53:29.458
24	9	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 25, "sequence": 3, "parentUnitId": 5}	2025-10-12 11:53:29.461
25	10	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 25, "sequence": 4, "parentUnitId": 5}	2025-10-12 11:53:29.464
26	11	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 25, "sequence": 5, "parentUnitId": 5}	2025-10-12 11:53:29.467
27	12	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 25, "sequence": 6, "parentUnitId": 5}	2025-10-12 11:53:29.47
28	13	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 25, "sequence": 7, "parentUnitId": 5}	2025-10-12 11:53:29.473
29	14	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 25, "sequence": 8, "parentUnitId": 5}	2025-10-12 11:53:29.475
30	15	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 25, "sequence": 9, "parentUnitId": 5}	2025-10-12 11:53:29.478
31	16	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 25, "sequence": 10, "parentUnitId": 5}	2025-10-12 11:53:29.48
32	17	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 25, "sequence": 11, "parentUnitId": 5}	2025-10-12 11:53:29.485
33	18	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 25, "sequence": 12, "parentUnitId": 5}	2025-10-12 11:53:29.488
34	19	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 25, "sequence": 13, "parentUnitId": 5}	2025-10-12 11:53:29.492
35	20	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 25, "sequence": 14, "parentUnitId": 5}	2025-10-12 11:53:29.495
36	21	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 25, "sequence": 15, "parentUnitId": 5}	2025-10-12 11:53:29.499
37	22	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 25, "sequence": 16, "parentUnitId": 5}	2025-10-12 11:53:29.502
38	23	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 25, "sequence": 17, "parentUnitId": 5}	2025-10-12 11:53:29.505
39	24	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 25, "sequence": 18, "parentUnitId": 5}	2025-10-12 11:53:29.508
40	25	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 25, "sequence": 19, "parentUnitId": 5}	2025-10-12 11:53:29.511
41	26	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 25, "sequence": 20, "parentUnitId": 5}	2025-10-12 11:53:29.515
42	27	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 25, "sequence": 21, "parentUnitId": 5}	2025-10-12 11:53:29.517
43	28	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 25, "sequence": 22, "parentUnitId": 5}	2025-10-12 11:53:29.52
44	29	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 25, "sequence": 23, "parentUnitId": 5}	2025-10-12 11:53:29.523
45	30	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 25, "sequence": 24, "parentUnitId": 5}	2025-10-12 11:53:29.525
46	31	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 25, "sequence": 25, "parentUnitId": 5}	2025-10-12 11:53:29.528
47	7	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-12 11:53:42.714
48	7	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-12 11:53:42.717
49	7	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-12 11:53:42.719
50	8	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-12 11:53:44.798
51	8	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-12 11:53:44.8
52	8	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-12 11:53:44.802
53	9	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-12 11:53:46.558
54	9	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-12 11:53:46.56
55	9	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-12 11:53:46.563
56	10	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-12 11:53:48.438
57	10	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-12 11:53:48.44
58	10	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-12 11:53:48.441
59	11	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-12 11:53:49.579
60	11	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-12 11:53:49.581
61	11	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-12 11:53:49.583
62	12	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-12 11:53:50.505
63	12	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-12 11:53:50.507
64	12	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-12 11:53:50.509
65	13	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-12 11:53:51.415
66	13	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-12 11:53:51.417
67	13	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-12 11:53:51.419
68	14	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-12 11:53:52.27
69	14	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-12 11:53:52.272
70	14	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-12 11:53:52.275
71	15	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-12 11:53:53.132
72	15	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-12 11:53:53.134
73	15	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-12 11:53:53.136
74	16	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-12 11:53:53.94
75	16	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-12 11:53:53.942
76	16	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-12 11:53:53.944
77	17	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-12 11:53:54.783
78	17	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-12 11:53:54.785
79	17	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-12 11:53:54.787
80	18	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-12 11:53:55.6
81	18	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-12 11:53:55.602
82	18	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-12 11:53:55.604
83	19	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-12 11:53:56.316
84	19	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-12 11:53:56.318
85	19	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-12 11:53:56.32
86	20	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-12 11:53:57.079
87	20	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-12 11:53:57.081
88	20	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-12 11:53:57.082
89	21	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-12 11:53:57.759
90	21	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-12 11:53:57.761
91	21	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-12 11:53:57.763
92	22	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-12 11:53:58.473
93	22	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-12 11:53:58.475
94	22	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-12 11:53:58.477
95	23	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-12 11:53:59.146
96	23	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-12 11:53:59.148
97	23	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-12 11:53:59.15
98	24	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-12 11:53:59.864
99	24	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-12 11:53:59.866
100	24	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-12 11:53:59.868
101	25	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-12 11:54:00.573
102	25	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-12 11:54:00.575
103	25	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-12 11:54:00.576
104	26	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-12 11:54:01.873
105	26	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-12 11:54:01.875
106	26	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-12 11:54:01.876
107	27	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-12 11:54:02.707
108	27	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-12 11:54:02.708
109	27	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-12 11:54:02.71
110	28	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-12 11:54:03.569
111	28	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-12 11:54:03.571
112	28	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-12 11:54:03.573
113	29	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-12 11:54:04.321
114	29	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-12 11:54:04.323
115	29	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-12 11:54:04.325
116	30	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-12 11:54:05.591
117	30	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-12 11:54:05.593
118	30	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-12 11:54:05.595
119	31	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-12 11:54:06.563
120	31	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-12 11:54:06.565
121	31	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-12 11:54:06.567
122	31	SALE	Товар продан за 1 ₽	{"isCredit": false, "buyerName": "", "salePrice": 1, "buyerPhone": ""}	2025-10-12 11:54:32.818
123	30	SALE	Товар продан за 0.66 ₽	{"isCredit": false, "buyerName": "", "salePrice": 0.66, "buyerPhone": ""}	2025-10-12 11:54:49.446
124	29	SALE	Товар продан за 0.66 ₽	{"isCredit": false, "buyerName": "", "salePrice": 0.66, "buyerPhone": ""}	2025-10-12 11:54:56.822
125	28	SALE	Товар продан за 1 ₽	{"isCredit": false, "buyerName": "", "salePrice": 1, "buyerPhone": ""}	2025-10-12 11:55:06.95
126	27	SALE	Товар продан за 1 ₽	{"isCredit": false, "buyerName": "", "salePrice": 1, "buyerPhone": ""}	2025-10-12 11:55:23.238
127	26	SALE	Товар продан за 1 ₽	{"isCredit": false, "buyerName": "", "salePrice": 1, "buyerPhone": ""}	2025-10-12 11:55:35.763
128	32	SYSTEM	Unit автоматически создан из продукта Трещотка реверсивная усиленная изогнутая с резиновой ручкой 1/4''(72зуб.)	\N	2025-10-12 12:05:22.25
129	32	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-12 12:05:38.936
130	33	SYSTEM	CLEAR unit создан как замена для кандидата #RF-802222-20251012-150522248-245652	{"purpose": "replacement_for_candidate", "sourceUnitId": 32, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "RF-802222-20251012-150522248-245652"}	2025-10-12 12:06:53.517
131	32	SPROUTED	Unit преобразован в SPROUTED для создания 3 дочерних заявок	{"pricePerUnit": 9.72, "childrenCount": 3}	2025-10-12 12:06:53.524
132	34	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 1, "parentUnitId": 32}	2025-10-12 12:06:53.528
133	35	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 2, "parentUnitId": 32}	2025-10-12 12:06:53.532
134	36	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 3, "sequence": 3, "parentUnitId": 32}	2025-10-12 12:06:53.535
135	34	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-12 12:07:38.538
136	34	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-12 12:07:38.542
137	34	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-12 12:07:38.544
138	35	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-12 12:07:40.368
139	35	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-12 12:07:40.371
140	35	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-12 12:07:40.373
141	36	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-12 12:07:41.884
142	36	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-12 12:07:41.886
143	36	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-12 12:07:41.888
144	36	SALE	Товар продан за 12 ₽	{"isCredit": false, "buyerName": "", "salePrice": 12, "buyerPhone": ""}	2025-10-12 12:08:13.907
145	37	SYSTEM	Unit автоматически создан из продукта Ключ комбинированный 25мм	\N	2025-10-12 12:13:35.968
146	37	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-12 12:13:49.968
147	38	SYSTEM	CLEAR unit создан как замена для кандидата #F-75525-20251012-151335966-333400	{"purpose": "replacement_for_candidate", "sourceUnitId": 37, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "F-75525-20251012-151335966-333400"}	2025-10-12 12:15:00.356
148	37	IN_REQUEST	Создана одиночная заявка, цена: 10	{"pricePerUnit": 10, "clearReplacementUnitId": 38}	2025-10-12 12:15:00.36
149	37	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-12 12:15:16.785
150	37	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-12 12:15:16.788
151	37	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-12 12:15:16.79
152	37	SALE	Товар продан за 10 ₽	{"isCredit": false, "buyerName": "", "salePrice": 10, "buyerPhone": ""}	2025-10-12 12:15:36.717
153	39	SYSTEM	Unit автоматически создан из продукта Проволока сварочная омедненная ER 70S-6 ф0,8мм (катушка D200 5 кг) SOLARIS (аналог СВ08Г2С)	\N	2025-10-12 12:21:31.324
154	39	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-12 12:22:55.571
155	40	SYSTEM	CLEAR unit создан как замена для кандидата #WM-ER70S6-08050-20251012-152131322-673647	{"purpose": "replacement_for_candidate", "sourceUnitId": 39, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "WM-ER70S6-08050-20251012-152131322-673647"}	2025-10-12 12:23:19.278
156	39	IN_REQUEST	Создана одиночная заявка, цена: 37.85	{"pricePerUnit": 37.85, "clearReplacementUnitId": 40}	2025-10-12 12:23:19.284
157	39	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-12 12:23:31.168
158	39	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-12 12:23:31.171
159	39	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-12 12:23:31.174
160	39	SALE	Товар продан за 47 ₽	{"isCredit": false, "buyerName": "", "salePrice": 47, "buyerPhone": ""}	2025-10-12 12:24:24.591
161	41	SYSTEM	Unit автоматически создан из продукта Съемник стопорных колец изогнутый на разжим (90°,L-175мм), в блистере	\N	2025-10-12 12:31:59.477
162	41	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-12 12:32:19.979
163	42	SYSTEM	CLEAR unit создан как замена для кандидата #PA-68-175SB-20251012-153159476-433437	{"purpose": "replacement_for_candidate", "sourceUnitId": 41, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "PA-68-175SB-20251012-153159476-433437"}	2025-10-12 12:32:48.879
164	41	SPROUTED	Unit преобразован в SPROUTED для создания 2 дочерних заявок	{"pricePerUnit": 8.7, "childrenCount": 2}	2025-10-12 12:32:48.894
165	43	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 1, "parentUnitId": 41}	2025-10-12 12:32:48.897
166	44	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 2, "parentUnitId": 41}	2025-10-12 12:32:48.9
167	43	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-12 12:32:59.698
168	43	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-12 12:32:59.71
169	43	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-12 12:32:59.714
170	44	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-12 12:33:01.79
171	44	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-12 12:33:01.792
172	44	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-12 12:33:01.794
173	44	SALE	Товар продан за 8.7 ₽	{"isCredit": false, "buyerName": "", "salePrice": 8.7, "buyerPhone": ""}	2025-10-12 12:33:40.542
174	43	SALE	Товар продан за 14 ₽	{"isCredit": false, "buyerName": "", "salePrice": 14, "buyerPhone": ""}	2025-10-12 12:33:52.67
175	45	SYSTEM	Unit автоматически создан из продукта Зажим с фиксацией 225мм	\N	2025-10-12 12:42:28.048
176	45	SYSTEM	Unit добавлен в кандидаты (1 шт.)	{"event": "ADDED_TO_CANDIDATE", "quantity": 1}	2025-10-12 12:42:40.388
177	46	SYSTEM	CLEAR unit создан как замена для кандидата #AT-JLP-10-20251012-154228046-106290	{"purpose": "replacement_for_candidate", "sourceUnitId": 45, "sourceLastLog": "Unit добавлен в кандидаты (1 шт.)", "sourceSerialNumber": "AT-JLP-10-20251012-154228046-106290"}	2025-10-12 12:54:10.905
178	45	SPROUTED	Unit преобразован в SPROUTED для создания 2 дочерних заявок	{"pricePerUnit": 12.96, "childrenCount": 2}	2025-10-12 12:54:10.913
179	47	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 1, "parentUnitId": 45}	2025-10-12 12:54:10.918
180	48	CHILD_CREATED	Дочерний unit создан из SPROUTED родителя	{"total": 2, "sequence": 2, "parentUnitId": 45}	2025-10-12 12:54:10.923
181	47	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-12 12:54:17.32
182	47	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-12 12:54:17.323
183	47	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-12 12:54:17.325
184	48	DELIVERY_START	Товар принят в доставку	{"previousStatus": "IN_REQUEST"}	2025-10-12 12:54:19.249
185	48	DELIVERY_ARRIVED	Товар прибыл на склад	{"previousStatus": "IN_DELIVERY"}	2025-10-12 12:54:19.251
186	48	IN_STORE	Товар размещен на складе	{"previousCardStatus": "ARRIVED", "previousProductStatus": null}	2025-10-12 12:54:19.253
187	48	SALE	Товар продан за 20 ₽	{"isCredit": false, "buyerName": "", "salePrice": 20, "buyerPhone": ""}	2025-10-12 12:54:55.255
\.


--
-- Data for Name: product_units; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_units (id, serial_number, "productId", sale_price, sold_at, created_at, updated_at, credit_paid_at, "isReturned", is_credit, "parentProductUnitId", product_category_id, product_category_name, product_code, product_description, product_name, product_tags, request_price_per_unit, returned_at, "statusCard", "statusProduct", created_at_candidate, created_at_request, "customerId", quantity_in_candidate, quantity_in_request, "supplierId", "spineId", "disassembledParentId", "disassemblyStatus", "isParsingAlgorithm", "disassemblyScenarioId") FROM stdin;
3	VR50840-20251012-144519826-798270	3	25	2025-10-12 11:48:12.651	2025-10-12 11:45:19.827	2025-10-12 11:48:12.652	\N	f	f	\N	10	Приспособление для центровки дисков сцепления	VR50840	Приспособление\r\nпредназначено для точного центрирования диска сцепления по отношению к\r\nнажимному диску перед их установкой.\r\n\r\nПодходит для большинства автомобилей, за исключением автомобилей с двухдисковым\r\nсцеплением.\r\n\r\n	Приспособление для центровки дисков сцепления Vertul VR50840	null	22	\N	ARRIVED	SOLD	2025-10-12 11:45:32.159	2025-10-12 11:46:55.721	\N	1	0	\N	3	\N	MONOLITH	f	\N
6	4603347328026-20251012-145329436-337330	4	\N	\N	2025-10-12 11:53:29.438	2025-10-12 11:53:29.438	\N	f	f	\N	11	Круги отрезные и обдирочные ф 125 мм	4603347328026		Круг отрезной 125х0.8x22.2 мм для металла LUGAABRASIV	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	4	\N	MONOLITH	f	\N
1	FK-933T1-10P-20251012-143027141-703663	2	25	2025-10-12 11:38:18.33	2025-10-12 11:30:27.143	2025-10-12 11:38:18.331	\N	f	f	\N	8	Болты к набору для замены сайлентблоков	FK-933T1-10P		Болт к набору для замены сайлентблоков М10	null	18	\N	ARRIVED	SOLD	2025-10-12 11:30:48.762	2025-10-12 11:31:36.477	\N	1	0	\N	2	\N	MONOLITH	f	\N
2	FK-933T1-10P-20251012-143136471-460366	2	\N	\N	2025-10-12 11:31:36.472	2025-10-12 11:39:11.963	\N	f	f	\N	8	Болты к набору для замены сайлентблоков	FK-933T1-10P		Болт к набору для замены сайлентблоков М10	null	\N	\N	CANDIDATE	\N	2025-10-12 11:39:11.962	\N	\N	1	0	\N	2	\N	MONOLITH	f	\N
5	4603347328026-20251012-145245709-522301	4	\N	\N	2025-10-12 11:52:45.71	2025-10-12 11:53:29.452	\N	f	f	\N	11	Круги отрезные и обдирочные ф 125 мм	4603347328026		Круг отрезной 125х0.8x22.2 мм для металла LUGAABRASIV	null	\N	\N	SPROUTED	\N	2025-10-12 11:52:56.221	\N	\N	1	0	\N	4	\N	MONOLITH	f	\N
4	VR50840-20251012-144655708-836339	3	\N	\N	2025-10-12 11:46:55.709	2025-10-12 11:46:55.709	\N	f	f	\N	10	Приспособление для центровки дисков сцепления	VR50840	Приспособление\r\nпредназначено для точного центрирования диска сцепления по отношению к\r\nнажимному диску перед их установкой.\r\n\r\nПодходит для большинства автомобилей, за исключением автомобилей с двухдисковым\r\nсцеплением.\r\n\r\n	Приспособление для центровки дисков сцепления Vertul VR50840	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	3	\N	MONOLITH	f	\N
9	4603347328026-20251012-145245709-522301/child-3-1760270009460-vv4lcrsqy	4	\N	\N	2025-10-12 11:53:29.461	2025-10-12 11:53:46.563	\N	f	f	5	11	Круги отрезные и обдирочные ф 125 мм	4603347328026		Круг отрезной 125х0.8x22.2 мм для металла LUGAABRASIV	null	0.66	\N	ARRIVED	IN_STORE	\N	2025-10-12 11:53:29.46	\N	0	0	\N	4	\N	MONOLITH	f	\N
10	4603347328026-20251012-145245709-522301/child-4-1760270009463-270z4jwpb	4	\N	\N	2025-10-12 11:53:29.464	2025-10-12 11:53:48.441	\N	f	f	5	11	Круги отрезные и обдирочные ф 125 мм	4603347328026		Круг отрезной 125х0.8x22.2 мм для металла LUGAABRASIV	null	0.66	\N	ARRIVED	IN_STORE	\N	2025-10-12 11:53:29.463	\N	0	0	\N	4	\N	MONOLITH	f	\N
11	4603347328026-20251012-145245709-522301/child-5-1760270009466-2pbvva02r	4	\N	\N	2025-10-12 11:53:29.467	2025-10-12 11:53:49.583	\N	f	f	5	11	Круги отрезные и обдирочные ф 125 мм	4603347328026		Круг отрезной 125х0.8x22.2 мм для металла LUGAABRASIV	null	0.66	\N	ARRIVED	IN_STORE	\N	2025-10-12 11:53:29.466	\N	0	0	\N	4	\N	MONOLITH	f	\N
12	4603347328026-20251012-145245709-522301/child-6-1760270009469-ud76pwup1	4	\N	\N	2025-10-12 11:53:29.47	2025-10-12 11:53:50.509	\N	f	f	5	11	Круги отрезные и обдирочные ф 125 мм	4603347328026		Круг отрезной 125х0.8x22.2 мм для металла LUGAABRASIV	null	0.66	\N	ARRIVED	IN_STORE	\N	2025-10-12 11:53:29.469	\N	0	0	\N	4	\N	MONOLITH	f	\N
13	4603347328026-20251012-145245709-522301/child-7-1760270009472-5mevumwod	4	\N	\N	2025-10-12 11:53:29.473	2025-10-12 11:53:51.419	\N	f	f	5	11	Круги отрезные и обдирочные ф 125 мм	4603347328026		Круг отрезной 125х0.8x22.2 мм для металла LUGAABRASIV	null	0.66	\N	ARRIVED	IN_STORE	\N	2025-10-12 11:53:29.472	\N	0	0	\N	4	\N	MONOLITH	f	\N
14	4603347328026-20251012-145245709-522301/child-8-1760270009474-ctjq6w697	4	\N	\N	2025-10-12 11:53:29.475	2025-10-12 11:53:52.275	\N	f	f	5	11	Круги отрезные и обдирочные ф 125 мм	4603347328026		Круг отрезной 125х0.8x22.2 мм для металла LUGAABRASIV	null	0.66	\N	ARRIVED	IN_STORE	\N	2025-10-12 11:53:29.474	\N	0	0	\N	4	\N	MONOLITH	f	\N
15	4603347328026-20251012-145245709-522301/child-9-1760270009477-lr2clx1py	4	\N	\N	2025-10-12 11:53:29.478	2025-10-12 11:53:53.136	\N	f	f	5	11	Круги отрезные и обдирочные ф 125 мм	4603347328026		Круг отрезной 125х0.8x22.2 мм для металла LUGAABRASIV	null	0.66	\N	ARRIVED	IN_STORE	\N	2025-10-12 11:53:29.477	\N	0	0	\N	4	\N	MONOLITH	f	\N
16	4603347328026-20251012-145245709-522301/child-10-1760270009480-gk6n00ohj	4	\N	\N	2025-10-12 11:53:29.48	2025-10-12 11:53:53.944	\N	f	f	5	11	Круги отрезные и обдирочные ф 125 мм	4603347328026		Круг отрезной 125х0.8x22.2 мм для металла LUGAABRASIV	null	0.66	\N	ARRIVED	IN_STORE	\N	2025-10-12 11:53:29.48	\N	0	0	\N	4	\N	MONOLITH	f	\N
17	4603347328026-20251012-145245709-522301/child-11-1760270009484-02w3tbo82	4	\N	\N	2025-10-12 11:53:29.485	2025-10-12 11:53:54.787	\N	f	f	5	11	Круги отрезные и обдирочные ф 125 мм	4603347328026		Круг отрезной 125х0.8x22.2 мм для металла LUGAABRASIV	null	0.66	\N	ARRIVED	IN_STORE	\N	2025-10-12 11:53:29.484	\N	0	0	\N	4	\N	MONOLITH	f	\N
18	4603347328026-20251012-145245709-522301/child-12-1760270009487-tjbq0v4vq	4	\N	\N	2025-10-12 11:53:29.488	2025-10-12 11:53:55.604	\N	f	f	5	11	Круги отрезные и обдирочные ф 125 мм	4603347328026		Круг отрезной 125х0.8x22.2 мм для металла LUGAABRASIV	null	0.66	\N	ARRIVED	IN_STORE	\N	2025-10-12 11:53:29.487	\N	0	0	\N	4	\N	MONOLITH	f	\N
19	4603347328026-20251012-145245709-522301/child-13-1760270009491-jpmdy55za	4	\N	\N	2025-10-12 11:53:29.492	2025-10-12 11:53:56.32	\N	f	f	5	11	Круги отрезные и обдирочные ф 125 мм	4603347328026		Круг отрезной 125х0.8x22.2 мм для металла LUGAABRASIV	null	0.66	\N	ARRIVED	IN_STORE	\N	2025-10-12 11:53:29.491	\N	0	0	\N	4	\N	MONOLITH	f	\N
7	4603347328026-20251012-145245709-522301/child-1-1760270009453-u6ah3keml	4	\N	\N	2025-10-12 11:53:29.454	2025-10-12 11:53:42.719	\N	f	f	5	11	Круги отрезные и обдирочные ф 125 мм	4603347328026		Круг отрезной 125х0.8x22.2 мм для металла LUGAABRASIV	null	0.66	\N	ARRIVED	IN_STORE	\N	2025-10-12 11:53:29.454	\N	0	0	\N	4	\N	MONOLITH	f	\N
8	4603347328026-20251012-145245709-522301/child-2-1760270009457-vj4uc0zdu	4	\N	\N	2025-10-12 11:53:29.458	2025-10-12 11:53:44.802	\N	f	f	5	11	Круги отрезные и обдирочные ф 125 мм	4603347328026		Круг отрезной 125х0.8x22.2 мм для металла LUGAABRASIV	null	0.66	\N	ARRIVED	IN_STORE	\N	2025-10-12 11:53:29.457	\N	0	0	\N	4	\N	MONOLITH	f	\N
21	4603347328026-20251012-145245709-522301/child-15-1760270009498-b1ca6x68t	4	\N	\N	2025-10-12 11:53:29.499	2025-10-12 11:53:57.763	\N	f	f	5	11	Круги отрезные и обдирочные ф 125 мм	4603347328026		Круг отрезной 125х0.8x22.2 мм для металла LUGAABRASIV	null	0.66	\N	ARRIVED	IN_STORE	\N	2025-10-12 11:53:29.498	\N	0	0	\N	4	\N	MONOLITH	f	\N
31	4603347328026-20251012-145245709-522301/child-25-1760270009527-l03dhsjxq	4	1	2025-10-12 11:54:32.816	2025-10-12 11:53:29.528	2025-10-12 11:54:32.818	\N	f	f	5	11	Круги отрезные и обдирочные ф 125 мм	4603347328026		Круг отрезной 125х0.8x22.2 мм для металла LUGAABRASIV	null	0.66	\N	ARRIVED	SOLD	\N	2025-10-12 11:53:29.527	\N	0	0	\N	4	\N	MONOLITH	f	\N
20	4603347328026-20251012-145245709-522301/child-14-1760270009494-6eypp3w0l	4	\N	\N	2025-10-12 11:53:29.495	2025-10-12 11:53:57.082	\N	f	f	5	11	Круги отрезные и обдирочные ф 125 мм	4603347328026		Круг отрезной 125х0.8x22.2 мм для металла LUGAABRASIV	null	0.66	\N	ARRIVED	IN_STORE	\N	2025-10-12 11:53:29.494	\N	0	0	\N	4	\N	MONOLITH	f	\N
28	4603347328026-20251012-145245709-522301/child-22-1760270009519-rpe3swom6	4	1	2025-10-12 11:55:06.948	2025-10-12 11:53:29.52	2025-10-12 11:55:06.95	\N	f	f	5	11	Круги отрезные и обдирочные ф 125 мм	4603347328026		Круг отрезной 125х0.8x22.2 мм для металла LUGAABRASIV	null	0.66	\N	ARRIVED	SOLD	\N	2025-10-12 11:53:29.519	\N	0	0	\N	4	\N	MONOLITH	f	\N
27	4603347328026-20251012-145245709-522301/child-21-1760270009516-nz5b1amop	4	1	2025-10-12 11:55:23.237	2025-10-12 11:53:29.517	2025-10-12 11:55:23.238	\N	f	f	5	11	Круги отрезные и обдирочные ф 125 мм	4603347328026		Круг отрезной 125х0.8x22.2 мм для металла LUGAABRASIV	null	0.66	\N	ARRIVED	SOLD	\N	2025-10-12 11:53:29.516	\N	0	0	\N	4	\N	MONOLITH	f	\N
30	4603347328026-20251012-145245709-522301/child-24-1760270009524-pjcd9b0fb	4	0.66	2025-10-12 11:54:49.444	2025-10-12 11:53:29.525	2025-10-12 11:54:49.446	\N	f	f	5	11	Круги отрезные и обдирочные ф 125 мм	4603347328026		Круг отрезной 125х0.8x22.2 мм для металла LUGAABRASIV	null	0.66	\N	ARRIVED	SOLD	\N	2025-10-12 11:53:29.524	\N	0	0	\N	4	\N	MONOLITH	f	\N
22	4603347328026-20251012-145245709-522301/child-16-1760270009501-q8w356wdy	4	\N	\N	2025-10-12 11:53:29.502	2025-10-12 11:53:58.477	\N	f	f	5	11	Круги отрезные и обдирочные ф 125 мм	4603347328026		Круг отрезной 125х0.8x22.2 мм для металла LUGAABRASIV	null	0.66	\N	ARRIVED	IN_STORE	\N	2025-10-12 11:53:29.501	\N	0	0	\N	4	\N	MONOLITH	f	\N
23	4603347328026-20251012-145245709-522301/child-17-1760270009504-ol4mhk56n	4	\N	\N	2025-10-12 11:53:29.505	2025-10-12 11:53:59.15	\N	f	f	5	11	Круги отрезные и обдирочные ф 125 мм	4603347328026		Круг отрезной 125х0.8x22.2 мм для металла LUGAABRASIV	null	0.66	\N	ARRIVED	IN_STORE	\N	2025-10-12 11:53:29.505	\N	0	0	\N	4	\N	MONOLITH	f	\N
24	4603347328026-20251012-145245709-522301/child-18-1760270009508-jl38rvw0i	4	\N	\N	2025-10-12 11:53:29.508	2025-10-12 11:53:59.868	\N	f	f	5	11	Круги отрезные и обдирочные ф 125 мм	4603347328026		Круг отрезной 125х0.8x22.2 мм для металла LUGAABRASIV	null	0.66	\N	ARRIVED	IN_STORE	\N	2025-10-12 11:53:29.508	\N	0	0	\N	4	\N	MONOLITH	f	\N
25	4603347328026-20251012-145245709-522301/child-19-1760270009511-2y3lxf4pa	4	\N	\N	2025-10-12 11:53:29.511	2025-10-12 11:54:00.576	\N	f	f	5	11	Круги отрезные и обдирочные ф 125 мм	4603347328026		Круг отрезной 125х0.8x22.2 мм для металла LUGAABRASIV	null	0.66	\N	ARRIVED	IN_STORE	\N	2025-10-12 11:53:29.511	\N	0	0	\N	4	\N	MONOLITH	f	\N
33	RF-802222-20251012-150653515-161198	5	\N	\N	2025-10-12 12:06:53.517	2025-10-12 12:06:53.517	\N	f	f	\N	14	1/4" Трещотки	RF-802222		Трещотка реверсивная усиленная изогнутая с резиновой ручкой 1/4''(72зуб.)	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	5	\N	MONOLITH	f	\N
32	RF-802222-20251012-150522248-245652	5	\N	\N	2025-10-12 12:05:22.25	2025-10-12 12:06:53.524	\N	f	f	\N	14	1/4" Трещотки	RF-802222		Трещотка реверсивная усиленная изогнутая с резиновой ручкой 1/4''(72зуб.)	null	\N	\N	SPROUTED	\N	2025-10-12 12:05:38.935	\N	\N	1	0	\N	5	\N	MONOLITH	f	\N
26	4603347328026-20251012-145245709-522301/child-20-1760270009514-00bgl8qb1	4	1	2025-10-12 11:55:35.762	2025-10-12 11:53:29.515	2025-10-12 11:55:35.763	\N	f	f	5	11	Круги отрезные и обдирочные ф 125 мм	4603347328026		Круг отрезной 125х0.8x22.2 мм для металла LUGAABRASIV	null	0.66	\N	ARRIVED	SOLD	\N	2025-10-12 11:53:29.514	\N	0	0	\N	4	\N	MONOLITH	f	\N
29	4603347328026-20251012-145245709-522301/child-23-1760270009522-bp1avyepm	4	0.66	2025-10-12 11:54:56.82	2025-10-12 11:53:29.523	2025-10-12 11:54:56.822	\N	f	f	5	11	Круги отрезные и обдирочные ф 125 мм	4603347328026		Круг отрезной 125х0.8x22.2 мм для металла LUGAABRASIV	null	0.66	\N	ARRIVED	SOLD	\N	2025-10-12 11:53:29.522	\N	0	0	\N	4	\N	MONOLITH	f	\N
36	RF-802222-20251012-150522248-245652/child-3-1760270813534-qnpwmim0v	5	12	2025-10-12 12:08:13.906	2025-10-12 12:06:53.535	2025-10-12 12:08:13.907	\N	f	f	32	14	1/4" Трещотки	RF-802222		Трещотка реверсивная усиленная изогнутая с резиновой ручкой 1/4''(72зуб.)	null	9.72	\N	ARRIVED	SOLD	\N	2025-10-12 12:06:53.534	\N	0	0	\N	5	\N	MONOLITH	f	\N
35	RF-802222-20251012-150522248-245652/child-2-1760270813530-i793w6bg7	5	\N	\N	2025-10-12 12:06:53.532	2025-10-12 12:07:40.373	\N	f	f	32	14	1/4" Трещотки	RF-802222		Трещотка реверсивная усиленная изогнутая с резиновой ручкой 1/4''(72зуб.)	null	9.72	\N	ARRIVED	IN_STORE	\N	2025-10-12 12:06:53.531	\N	0	0	\N	5	\N	MONOLITH	f	\N
34	RF-802222-20251012-150522248-245652/child-1-1760270813526-v629rugmv	5	\N	\N	2025-10-12 12:06:53.528	2025-10-12 12:07:38.544	\N	f	f	32	14	1/4" Трещотки	RF-802222		Трещотка реверсивная усиленная изогнутая с резиновой ручкой 1/4''(72зуб.)	null	9.72	\N	ARRIVED	IN_STORE	\N	2025-10-12 12:06:53.526	\N	0	0	\N	5	\N	MONOLITH	f	\N
38	F-75525-20251012-151500354-390847	6	\N	\N	2025-10-12 12:15:00.356	2025-10-12 12:15:00.356	\N	f	f	\N	16	Комбинированные	F-75525		Ключ комбинированный 25мм	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	6	\N	MONOLITH	f	\N
44	PA-68-175SB-20251012-153159476-433437/child-2-1760272368899-rgqpkxcf8	8	14	2025-10-12 12:33:40.54	2025-10-12 12:32:48.9	2025-10-12 12:33:40.542	\N	f	f	41	22	Съемник стопорных колец изогнутый на разжим (90°,L-175мм), в блистере	PA-68-175SB		Съемник стопорных колец изогнутый на разжим (90°,L-175мм), в блистере	null	8.7	\N	ARRIVED	SOLD	\N	2025-10-12 12:32:48.899	\N	0	0	\N	8	\N	MONOLITH	f	\N
48	AT-JLP-10-20251012-154228046-106290/child-2-1760273650921-7s8tds8u4	9	20	2025-10-12 12:54:55.244	2025-10-12 12:54:10.923	2025-10-12 12:54:55.255	\N	f	f	45	23	Зажимы с фиксатором	AT-JLP-10		Зажим с фиксацией 225мм	null	12.96	\N	ARRIVED	SOLD	\N	2025-10-12 12:54:10.922	\N	0	0	\N	9	\N	MONOLITH	f	\N
37	F-75525-20251012-151335966-333400	6	12	2025-10-12 12:15:36.715	2025-10-12 12:13:35.968	2025-10-12 12:15:36.717	\N	f	f	\N	16	Комбинированные	F-75525		Ключ комбинированный 25мм	null	10	\N	ARRIVED	SOLD	2025-10-12 12:13:49.967	2025-10-12 12:15:00.359	\N	1	0	\N	6	\N	MONOLITH	f	\N
46	AT-JLP-10-20251012-155410904-835043	9	\N	\N	2025-10-12 12:54:10.905	2025-10-12 12:54:10.905	\N	f	f	\N	23	Зажимы с фиксатором	AT-JLP-10		Зажим с фиксацией 225мм	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	9	\N	MONOLITH	f	\N
40	WM-ER70S6-08050-20251012-152319277-048325	7	\N	\N	2025-10-12 12:23:19.278	2025-10-12 12:23:19.278	\N	f	f	\N	19	Проволока сварочная ф0,8мм	WM-ER70S6-08050		Проволока сварочная омедненная ER 70S-6 ф0,8мм (катушка D200 5 кг) SOLARIS (аналог СВ08Г2С)	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	7	\N	MONOLITH	f	\N
45	AT-JLP-10-20251012-154228046-106290	9	\N	\N	2025-10-12 12:42:28.048	2025-10-12 12:54:10.913	\N	f	f	\N	23	Зажимы с фиксатором	AT-JLP-10		Зажим с фиксацией 225мм	null	\N	\N	SPROUTED	\N	2025-10-12 12:42:40.387	\N	\N	1	0	\N	9	\N	MONOLITH	f	\N
43	PA-68-175SB-20251012-153159476-433437/child-1-1760272368896-swmdi7tfm	8	14	2025-10-12 12:33:52.669	2025-10-12 12:32:48.897	2025-10-12 12:33:52.67	\N	f	f	41	22	Съемник стопорных колец изогнутый на разжим (90°,L-175мм), в блистере	PA-68-175SB		Съемник стопорных колец изогнутый на разжим (90°,L-175мм), в блистере	null	8.7	\N	ARRIVED	SOLD	\N	2025-10-12 12:32:48.896	\N	0	0	\N	8	\N	MONOLITH	f	\N
39	WM-ER70S6-08050-20251012-152131322-673647	7	47	2025-10-12 12:24:24.59	2025-10-12 12:21:31.324	2025-10-12 12:24:24.591	\N	f	f	\N	19	Проволока сварочная ф0,8мм	WM-ER70S6-08050		Проволока сварочная омедненная ER 70S-6 ф0,8мм (катушка D200 5 кг) SOLARIS (аналог СВ08Г2С)	null	37.85	\N	ARRIVED	SOLD	2025-10-12 12:22:55.57	2025-10-12 12:23:19.282	\N	1	0	\N	7	\N	MONOLITH	f	\N
42	PA-68-175SB-20251012-153248878-521022	8	\N	\N	2025-10-12 12:32:48.879	2025-10-12 12:32:48.879	\N	f	f	\N	22	Съемник стопорных колец изогнутый на разжим (90°,L-175мм), в блистере	PA-68-175SB		Съемник стопорных колец изогнутый на разжим (90°,L-175мм), в блистере	null	\N	\N	CLEAR	\N	\N	\N	\N	0	0	\N	8	\N	MONOLITH	f	\N
41	PA-68-175SB-20251012-153159476-433437	8	\N	\N	2025-10-12 12:31:59.477	2025-10-12 12:32:48.894	\N	f	f	\N	22	Съемник стопорных колец изогнутый на разжим (90°,L-175мм), в блистере	PA-68-175SB		Съемник стопорных колец изогнутый на разжим (90°,L-175мм), в блистере	null	\N	\N	SPROUTED	\N	2025-10-12 12:32:19.978	\N	\N	1	0	\N	8	\N	MONOLITH	f	\N
47	AT-JLP-10-20251012-154228046-106290/child-1-1760273650916-c7yoxhhb9	9	\N	\N	2025-10-12 12:54:10.918	2025-10-12 12:54:17.325	\N	f	f	45	23	Зажимы с фиксатором	AT-JLP-10		Зажим с фиксацией 225мм	null	12.96	\N	ARRIVED	IN_STORE	\N	2025-10-12 12:54:10.916	\N	0	0	\N	9	\N	MONOLITH	f	\N
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, code, name, description, "categoryId", "createdAt", "updatedAt", "brandId", "spineId") FROM stdin;
1	GP5016-40	Круг лепестковый 125х22мм P40 плоск. GEPARD (GP5016-40) (плоский КЛТ-1)		4	2025-10-12 11:23:15.552	2025-10-12 11:23:15.552	1	1
2	FK-933T1-10P	Болт к набору для замены сайлентблоков М10		8	2025-10-12 11:30:13.478	2025-10-12 11:30:13.478	3	2
3	VR50840	Приспособление для центровки дисков сцепления Vertul VR50840	Приспособление\r\nпредназначено для точного центрирования диска сцепления по отношению к\r\nнажимному диску перед их установкой.\r\n\r\nПодходит для большинства автомобилей, за исключением автомобилей с двухдисковым\r\nсцеплением.\r\n\r\n	10	2025-10-12 11:45:05.205	2025-10-12 11:45:05.205	4	3
4	4603347328026	Круг отрезной 125х0.8x22.2 мм для металла LUGAABRASIV		11	2025-10-12 11:52:36.243	2025-10-12 11:52:36.243	5	4
5	RF-802222	Трещотка реверсивная усиленная изогнутая с резиновой ручкой 1/4''(72зуб.)		14	2025-10-12 12:04:55.209	2025-10-12 12:04:55.209	6	5
6	F-75525	Ключ комбинированный 25мм		16	2025-10-12 12:13:28.793	2025-10-12 12:13:28.793	7	6
7	WM-ER70S6-08050	Проволока сварочная омедненная ER 70S-6 ф0,8мм (катушка D200 5 кг) SOLARIS (аналог СВ08Г2С)		19	2025-10-12 12:21:26.2	2025-10-12 12:21:26.2	8	7
8	PA-68-175SB	Съемник стопорных колец изогнутый на разжим (90°,L-175мм), в блистере		22	2025-10-12 12:31:33.884	2025-10-12 12:31:33.884	9	8
9	AT-JLP-10	Зажим с фиксацией 225мм		23	2025-10-12 12:42:19.091	2025-10-12 12:42:19.091	10	9
\.


--
-- Data for Name: spines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.spines (id, name, slug, "categoryId", "imagePath", "createdAt", "updatedAt", "brandData") FROM stdin;
1	Круг лепестковый 125х22мм P40 плоск.	krug-lepestkovyy-125h22mm-p40-plosk	4	\N	2025-10-11 11:48:25.218	2025-10-11 11:48:25.218	\N
2	Болт к набору для замены сайлентблоков М10	bolt-k-naboru-dlya-zameny-saylentblokov-m10	8	\N	2025-10-12 11:28:24.045	2025-10-12 11:30:27.218	{"FORCEKRAFT":{"displayName":"Болт к набору для замены сайлентблоков М10","imagePath":"/img/products/FK-933T1-10P/FK-933T1-10P_1760268613489_1.jpg","productCode":"FK-933T1-10P","updatedAt":"2025-10-12T11:30:27.217Z"}}
3	Приспособление для центровки дисков сцепления	prisposoblenie-dlya-tsentrovki-diskov-stsepleniya	10	\N	2025-10-12 11:43:04.34	2025-10-12 11:45:19.849	{"Vertul":{"displayName":"Приспособление для центровки дисков сцепления Vertul VR50840","imagePath":"/img/products/VR50840/VR50840_1760269505216_1.jpg","productCode":"VR50840","updatedAt":"2025-10-12T11:45:19.848Z"}}
4	Круг отрезной 125х0.8x22.2	krug-otreznoy-125h0-8x22-2	11	\N	2025-10-12 11:51:33.606	2025-10-12 11:52:45.731	{"LUGAABRASIV":{"displayName":"Круг отрезной 125х0.8x22.2 мм для металла LUGAABRASIV","imagePath":"/img/products/4603347328026/4603347328026_1760269956262_1.jpg","productCode":"4603347328026","updatedAt":"2025-10-12T11:52:45.730Z"}}
5	Трещотка реверсивная усиленная изогнутая с резиновой ручкой	treschotka-reversivnaya-usilennaya-izognutaya-s-rezinovoy-ruchkoy	14	\N	2025-10-12 12:03:31.067	2025-10-12 12:05:22.271	{"RockFORCE":{"displayName":"Трещотка реверсивная усиленная изогнутая с резиновой ручкой 1/4''(72зуб.)","imagePath":"/img/products/RF-802222/RF-802222_1760270695222_1.jpg","productCode":"RF-802222","updatedAt":"2025-10-12T12:05:22.270Z"}}
6	Ключ комбинированный 25мм	klyuch-kombinirovannyy-25mm	16	\N	2025-10-12 12:10:55.633	2025-10-12 12:13:35.999	{"Forsage":{"displayName":"Ключ комбинированный 25мм","imagePath":"/img/products/F-75525/F-75525_1760271208817_1.jpg","productCode":"F-75525","updatedAt":"2025-10-12T12:13:35.998Z"}}
7	Проволока сварочная ф0,8мм	provoloka-svarochnaya-f0-8mm	19	\N	2025-10-12 12:19:32.045	2025-10-12 12:21:31.355	{"SOLARIS":{"displayName":"Проволока сварочная омедненная ER 70S-6 ф0,8мм (катушка D200 5 кг) SOLARIS (аналог СВ08Г2С)","imagePath":"/img/products/WM-ER70S6-08050/WM-ER70S6-08050_1760271686213_1.jpg","productCode":"WM-ER70S6-08050","updatedAt":"2025-10-12T12:21:31.354Z"}}
8	Съемник стопорных колец изогнутый на разжим	s-emnik-stopornyh-kolets-izognutyy-na-razzhim	22	\N	2025-10-12 12:29:23.847	2025-10-12 12:31:59.509	{"Partner":{"displayName":"Съемник стопорных колец изогнутый на разжим (90°,L-175мм), в блистере","imagePath":"/img/products/PA-68-175SB/PA-68-175SB_1760272293897_1.jpg","productCode":"PA-68-175SB","updatedAt":"2025-10-12T12:31:59.507Z"}}
9	Зажим с фиксацией 225мм	zazhim-s-fiksatsiey-225mm	23	\N	2025-10-12 12:40:11.66	2025-10-12 12:42:28.078	{"Airline":{"displayName":"Зажим с фиксацией 225мм","imagePath":"/img/products/AT-JLP-10/AT-JLP-10_1760272939101_1.jpg","productCode":"AT-JLP-10","updatedAt":"2025-10-12T12:42:28.077Z"}}
10	Набор инструментов 108пр.1/4''&1/2''(6-гран)(4-32мм)	nabor-instrumentov-108pr-1-4-1-2-6-gran-4-32mm	25	\N	2025-10-12 12:59:54.95	2025-10-12 12:59:54.95	\N
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

SELECT pg_catalog.setval('public.brands_id_seq', 1, true);


--
-- Name: cash_days_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cash_days_id_seq', 2, true);


--
-- Name: cash_events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cash_events_id_seq', 1, false);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 1, false);


--
-- Name: customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customers_id_seq', 1, false);


--
-- Name: disassembly_scenarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.disassembly_scenarios_id_seq', 1, false);


--
-- Name: product_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_images_id_seq', 1, false);


--
-- Name: product_unit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_unit_logs_id_seq', 1, false);


--
-- Name: product_units_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_units_id_seq', 1, false);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 1, false);


--
-- Name: spines_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.spines_id_seq', 1, false);


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
-- Name: product_images product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);


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
-- Name: product_units_serial_number_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX product_units_serial_number_key ON public.product_units USING btree (serial_number);


--
-- Name: products_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX products_code_key ON public.products USING btree (code);


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
-- Name: product_images product_images_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT "product_images_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE RESTRICT;


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

